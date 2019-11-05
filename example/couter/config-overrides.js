// const path = require('path');
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

// module.exports = function override(config) {
//   config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
//   const index = config.module.rules.findIndex(n => n.oneOf);
//   const oneOf = [...config.module.rules[index].oneOf];
//   const tsLoader = oneOf[1];
//   tsLoader.include = path.resolve(tsLoader.include, '../../../');
//   oneOf[1] = tsLoader;
//   config.module.rules[index] = { oneOf };
//   return config;
// };
