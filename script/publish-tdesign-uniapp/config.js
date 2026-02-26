const path = require('path');

const TDESIGN_UNIAPP_SOURCE = path.resolve(__dirname, '../../../tdesign-miniprogram/packages/tdesign-uniapp/dist');
const TDESIGN_UNIAPP_TARGET = './uni_modules/tdesign-uniapp/components';
const TDESIGN_UNIAPP_PACKAGE_JSON = path.resolve(TDESIGN_UNIAPP_SOURCE, '../package.json');
const TDESIGN_UNIAPP_README = path.resolve(TDESIGN_UNIAPP_SOURCE, '../README.md');

const TDESIGN_UNIAPP_CHAT_SOURCE = path.resolve(__dirname, '../../../tdesign-miniprogram/packages/tdesign-uniapp-chat/dist');
const TDESIGN_UNIAPP_CHAT_TARGET = './uni_modules/tdesign-uniapp-chat/components';
const TDESIGN_UNIAPP_CHAT_PACKAGE_JSON = path.resolve(TDESIGN_UNIAPP_CHAT_SOURCE, '../package.json');
const TDESIGN_UNIAPP_CHAT_README = path.resolve(TDESIGN_UNIAPP_CHAT_SOURCE, '../README.md');


const CONFIG = {
  TDESIGN_UNIAPP_SOURCE,
  TDESIGN_UNIAPP_TARGET,
  TDESIGN_UNIAPP_PACKAGE_JSON,
  TDESIGN_UNIAPP_README,

  TDESIGN_UNIAPP_CHAT_SOURCE,
  TDESIGN_UNIAPP_CHAT_TARGET,
  TDESIGN_UNIAPP_CHAT_PACKAGE_JSON,
  TDESIGN_UNIAPP_CHAT_README,
}

module.exports = {
  CONFIG,
}
