const path = require('path');
const { replaceAlias } = require('t-comm/lib/replace-alias');

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '../../');

replaceAlias({
  rootDir: ROOT_DIR,
  // alias 映射关系：alias => 对应的真实目录（相对于项目根目录）
  aliasMap: {
    '@tdesign/uniapp': 'uni_modules/tdesign-uniapp/components',
    '@tdesign/uniapp-chat': 'uni_modules/tdesign-uniapp-chat/components',
  },
  // 需要扫描的目录（相对于项目根目录）
  scanDirs: ['style', 'pages', 'pages-more', 'components', 'mixins', 'uni_modules/tdesign-uniapp-chat/components'],
  // 需要扫描的根目录文件
  scanRootFiles: ['main.js', 'App.vue'],
  // 支持的文件扩展名
  supportedExtensions: ['.vue', '.js', '.ts', '.d.ts', '.less', '.css', '.scss'],
});
