const path = require('path');
const { copyDist } = require('./core');
const { CONFIG } = require('./config')


function main() {
  const {
    TDESIGN_UNIAPP_SOURCE,
    TDESIGN_UNIAPP_TARGET,
    TDESIGN_UNIAPP_PACKAGE_JSON,
    TDESIGN_UNIAPP_README,
  } = CONFIG;

  copyDist({
    source: TDESIGN_UNIAPP_SOURCE,
    target: TDESIGN_UNIAPP_TARGET,
    packageJson: TDESIGN_UNIAPP_PACKAGE_JSON,
    readme: TDESIGN_UNIAPP_README,
    uniModulesPackageJson: path.resolve(__dirname, './uni-modules.package.json'),
  })
}

main();
