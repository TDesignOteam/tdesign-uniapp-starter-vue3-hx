const { replaceAlias } = require('t-comm/lib/replace-alias');
const { ROOT_DIR, ALIAS_MAP, SCAN_DIRS, SCAN_ROOT_FILES, SUPPORTED_EXTENSIONS } = require('./config');

replaceAlias({
  rootDir: ROOT_DIR,
  aliasMap: ALIAS_MAP,
  scanDirs: SCAN_DIRS,
  scanRootFiles: SCAN_ROOT_FILES,
  supportedExtensions: SUPPORTED_EXTENSIONS,
});
