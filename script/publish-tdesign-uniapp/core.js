const path = require('path');
const { writeFileSync, readFileSync, execCommand } = require('t-comm');


function copyDist({
  source,
  target,
  packageJson,
  readme,
  uniModulesPackageJson
}) {
  execCommand(`rm -rf ${target}/* && mkdir -p ${target} && cp -r ${source}/* ${target}`);

  const pkg = readFileSync(uniModulesPackageJson, true)
  const newPkg = readFileSync(packageJson, true)
  pkg.version = newPkg.version
  
  writeFileSync(path.resolve(target, '../', './package.json'), pkg, true)
  writeFileSync(path.resolve(target, '../', './readme.md'), readFileSync(readme))
}

module.exports = {
  copyDist,
}
