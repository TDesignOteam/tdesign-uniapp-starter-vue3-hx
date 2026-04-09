const path = require('path');
const fs = require('fs');
const { replaceAlias, collectFiles } = require('t-comm/lib/replace-alias');
const { ROOT_DIR, ALIAS_MAP, DIRECT_ALIAS_MAP, SCAN_DIRS, SCAN_ROOT_FILES, SUPPORTED_EXTENSIONS } = require('./config');

/**
 * 替换文件中直接引入 alias 本身的情况（不带子路径）
 * 如 import { Toast } from '@tdesign/uniapp' => import { Toast } from '相对路径/index'
 */
function replaceDirectAliasInFiles(options) {
  const allFiles = collectFiles(options);
  let replacedCount = 0;

  for (const filePath of allFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let hasReplaced = false;

    for (const [alias, entryFile] of Object.entries(DIRECT_ALIAS_MAP)) {
      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(['\"])${escapedAlias}(['\"])`, 'g');

      content = content.replace(regex, (match, quote1, quote2) => {
        const targetAbsPath = path.resolve(ROOT_DIR, entryFile);
        const fileDir = path.dirname(filePath);
        let relativePath = path.relative(fileDir, targetAbsPath);
        if (!relativePath.startsWith('.')) {
          relativePath = `./${relativePath}`;
        }
        relativePath = relativePath.split(path.sep).join('/');
        hasReplaced = true;
        return `${quote1}${relativePath}${quote2}`;
      });
    }

    if (hasReplaced) {
      fs.writeFileSync(filePath, content, 'utf-8');
      const relativePath = path.relative(ROOT_DIR, filePath);
      console.log(`  ✅ ${relativePath} (直接引入替换)`);
      replacedCount++;
    }
  }

  return replacedCount;
}

// 先替换带子路径的 alias（如 @tdesign/uniapp/toast）
replaceAlias({
  rootDir: ROOT_DIR,
  aliasMap: ALIAS_MAP,
  scanDirs: SCAN_DIRS,
  scanRootFiles: SCAN_ROOT_FILES,
  supportedExtensions: SUPPORTED_EXTENSIONS,
});

// 再替换直接引入 alias 本身的情况（如 @tdesign/uniapp）
console.log('\n🔄 开始替换直接引入 alias 的路径...\n');
const directCount = replaceDirectAliasInFiles({
  rootDir: ROOT_DIR,
  aliasMap: ALIAS_MAP,
  scanDirs: SCAN_DIRS,
  scanRootFiles: SCAN_ROOT_FILES,
  supportedExtensions: SUPPORTED_EXTENSIONS,
});
if (directCount > 0) {
  console.log(`\n✨ 共替换了 ${directCount} 个文件中的直接引入 alias 路径`);
} else {
  console.log('  ℹ️  没有找到需要替换的直接引入 alias 路径');
}
