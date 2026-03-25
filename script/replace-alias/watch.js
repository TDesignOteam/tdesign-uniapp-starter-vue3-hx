const watch = require('gulp-watch');
const path = require('path');
const net = require('net');
const { replaceAliasInFile } = require('t-comm/lib/replace-alias');

// 监听端口（防止重复启动）
const PORT = 12346;

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '../../');

// alias 映射关系
const ALIAS_MAP = {
  '@tdesign/uniapp': 'uni_modules/tdesign-uniapp/components',
  '@tdesign/uniapp-chat': 'uni_modules/tdesign-uniapp-chat/components',
};

// 支持的文件扩展名
const SUPPORTED_EXTENSIONS = ['.vue', '.js', '.ts', '.less', '.css', '.scss'];

// 需要监听的目录（相对于项目根目录）
const SCAN_DIRS = ['style', 'pages', 'pages-more', 'components', 'mixins', 'uni_modules/tdesign-uniapp-chat/components'];

// 需要监听的根目录文件
const SCAN_ROOT_FILES = ['main.js', 'App.vue'];

// 构建 glob 模式
function buildGlobPatterns() {
  const extGlob = `**/*{${SUPPORTED_EXTENSIONS.join(',')}}`;
  const patterns = [];

  for (const dir of SCAN_DIRS) {
    patterns.push(path.join(ROOT_DIR, dir, extGlob));
  }

  for (const file of SCAN_ROOT_FILES) {
    patterns.push(path.join(ROOT_DIR, file));
  }

  return patterns;
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close(() => resolve(false));
    });
    server.listen(port);
  });
}

function gracefulShutdown() {
  console.log('\n[Watch] 收到终止信号，关闭监听器...');
  process.exit(0);
}

async function main() {
  if (await isPortInUse(PORT)) {
    console.log('[Watch] 监听已在其他终端运行');
    return;
  }

  // 创建监听服务器（占用端口，防止重复启动）
  const server = net.createServer();
  server.listen(PORT);

  const patterns = buildGlobPatterns();
  console.log('👀 开始监听文件变化...');
  console.log(`   监听目录: ${SCAN_DIRS.join(', ')}`);
  console.log(`   监听文件: ${SCAN_ROOT_FILES.join(', ')}\n`);

  watch(patterns, (file) => {
    const { event, history } = file || {};

    if (event === 'unlink') return;
    if (!history?.[0]) return;

    const filePath = history[0];
    const relativePath = path.relative(ROOT_DIR, filePath);

    const { replaced, error } = replaceAliasInFile(filePath, ROOT_DIR, ALIAS_MAP);

    if (error) {
      console.log(`  ⚠️  [${relativePath}] 替换失败: ${error}`);
    } else if (replaced) {
      console.log(`  ✅ [${relativePath}] alias 已替换`);
    }
  });

  // 监听进程终止信号
  process.on('exit', () => server.close());
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

main();
