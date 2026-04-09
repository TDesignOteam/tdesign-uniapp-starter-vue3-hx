const path = require('path');

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '../../');

// alias 映射关系：alias => 对应的真实目录（相对于项目根目录）
const ALIAS_MAP = {
  '@tdesign/uniapp': 'uni_modules/tdesign-uniapp/components',
  '@tdesign/uniapp-chat': 'uni_modules/tdesign-uniapp-chat/components',
};

// 直接引入 alias 本身时的映射（不带子路径），如 import { Toast } from '@tdesign/uniapp'
// 值为入口文件路径（相对于项目根目录）
const DIRECT_ALIAS_MAP = {
  '@tdesign/uniapp': 'uni_modules/tdesign-uniapp/components/index',
  '@tdesign/uniapp-chat': 'uni_modules/tdesign-uniapp-chat/components/index',
};

// 支持的文件扩展名
const SUPPORTED_EXTENSIONS = ['.vue', '.js', '.ts', '.d.ts', '.less', '.css', '.scss'];

// 需要扫描的目录（相对于项目根目录）
const SCAN_DIRS = ['style', 'pages', 'pages-more', 'components', 'mixins', 'uni_modules/tdesign-uniapp-chat/components'];

// 需要扫描的根目录文件
const SCAN_ROOT_FILES = ['main.js', 'App.vue'];

module.exports = {
  ROOT_DIR,
  ALIAS_MAP,
  DIRECT_ALIAS_MAP,
  SUPPORTED_EXTENSIONS,
  SCAN_DIRS,
  SCAN_ROOT_FILES,
};
