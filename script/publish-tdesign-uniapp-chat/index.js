const path = require('path');
const { copyDist } = require('../publish-tdesign-uniapp/core');
const { CONFIG } = require('../publish-tdesign-uniapp/config')


function main() {
  const {
    TDESIGN_UNIAPP_CHAT_SOURCE,
    TDESIGN_UNIAPP_CHAT_TARGET,
    TDESIGN_UNIAPP_CHAT_PACKAGE_JSON,
    TDESIGN_UNIAPP_CHAT_README,
  } = CONFIG;

  copyDist({
    source: TDESIGN_UNIAPP_CHAT_SOURCE,
    target: TDESIGN_UNIAPP_CHAT_TARGET,
    packageJson: TDESIGN_UNIAPP_CHAT_PACKAGE_JSON,
    readme: TDESIGN_UNIAPP_CHAT_README,
    uniModulesPackageJson: path.resolve(__dirname, './uni-modules.package.json'),
  })
}

main();
