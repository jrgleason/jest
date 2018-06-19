/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                       
                                              
                                                       
                                                

import fs from 'fs';
import path from 'path';
import nodeModulesPaths from './node_modules_paths';
import isBuiltinModule from './is_builtin_module';
import defaultResolver from './default_resolver.js';
import chalk from 'chalk';

                        
                    
                           
                            
                          
                                   
                                                   
                           
                            
                  
                 
   

                              
                
                    
                             
                                  
                      
                   
                  
   

                                
                
                     
   

                                                               

const NATIVE_PLATFORM = 'native';

// We might be inside a symlink.
const cwd = process.cwd();
const resolvedCwd = fs.realpathSync(cwd) || cwd;
const nodePaths = process.env.NODE_PATH
  ? process.env.NODE_PATH.split(path.delimiter)
      .filter(Boolean)
      // The resolver expects absolute paths.
      .map(p => path.resolve(resolvedCwd, p))
  : null;

class Resolver {
                           
                        
                                                           
                                                            
                                                                 

  constructor(moduleMap           , options                ) {
    this._options = {
      browser: options.browser,
      defaultPlatform: options.defaultPlatform,
      extensions: options.extensions,
      hasCoreModules:
        options.hasCoreModules === undefined ? true : options.hasCoreModules,
      moduleDirectories: options.moduleDirectories || ['node_modules'],
      moduleNameMapper: options.moduleNameMapper,
      modulePaths: options.modulePaths,
      platforms: options.platforms,
      resolver: options.resolver,
      rootDir: options.rootDir,
    };
    this._moduleMap = moduleMap;
    this._moduleIDCache = Object.create(null);
    this._moduleNameCache = Object.create(null);
    this._modulePathCache = Object.create(null);
  }

  static findNodeModule(path      , options                      )        {
    const resolver = options.resolver
      ? /* $FlowFixMe */
        require(options.resolver)
      : defaultResolver;
    const paths = options.paths;

    try {
      return resolver(path, {
        basedir: options.basedir,
        browser: options.browser,
        extensions: options.extensions,
        moduleDirectory: options.moduleDirectory,
        paths: paths ? (nodePaths || []).concat(paths) : nodePaths,
        rootDir: options.rootDir,
      });
    } catch (e) {
        return null;
    }
  }

  resolveModule(
    from      ,
    moduleName        ,
    options                      ,
  )       {
    const dirname = path.dirname(from);
    const paths = this._options.modulePaths;
    const moduleDirectory = this._options.moduleDirectories;
    const key = dirname + path.delimiter + moduleName;
    const defaultPlatform = this._options.defaultPlatform;
    const extensions = this._options.extensions.slice();
    if (this._supportsNativePlatform()) {
      extensions.unshift(
        ...this._options.extensions.map(ext => '.' + NATIVE_PLATFORM + ext),
      );
    }
    if (defaultPlatform) {
      extensions.unshift(
        ...this._options.extensions.map(ext => '.' + defaultPlatform + ext),
      );
    }

    // 0. If we have already resolved this module for this directory name,
    //    return a value from the cache.
    if (this._moduleNameCache[key]) {
      return this._moduleNameCache[key];
    }

    // 1. Check if the module is a haste module.
    let module = this.getModule(moduleName);
    if (module) {
      return (this._moduleNameCache[key] = module);
    }

    // 2. Check if the module is a node module and resolve it based on
    //    the node module resolution algorithm.
    // If skipNodeResolution is given we ignore all modules that look like
    // node modules (ie. are not relative requires). This enables us to speed
    // up resolution when we build a dependency graph because we don't have
    // to look at modules that may not exist and aren't mocked.
    const skipResolution =
      options && options.skipNodeResolution && !moduleName.includes(path.sep);

    const resolveNodeModule = name => {
      return Resolver.findNodeModule(name, {
        basedir: dirname,
        browser: this._options.browser,
        extensions,
        moduleDirectory,
        paths,
        resolver: this._options.resolver,
        rootDir: this._options.rootDir,
      });
    };

    if (!skipResolution) {
      module = resolveNodeModule(moduleName);

      if (module) {
        return (this._moduleNameCache[key] = module);
      }
    }

    // 3. Resolve "haste packages" which are `package.json` files outside of
    // `node_modules` folders anywhere in the file system.
    const parts = moduleName.split('/');
    const hastePackage = this.getPackage(parts.shift());
    if (hastePackage) {
      try {
        const module = path.join.apply(
          path,
          [path.dirname(hastePackage)].concat(parts),
        );
        // try resolving with custom resolver first to support extensions,
        // then fallback to require.resolve
        return (this._moduleNameCache[key] =
          resolveNodeModule(module) || require.resolve(module));
      } catch (ignoredError) {
        // TODO: WTF
      }
    }

    // 4. Throw an error if the module could not be found. `resolve.sync`
    //    only produces an error based on the dirname but we have the actual
    //    current module name available.
    const relativePath = path.relative(dirname, from);
    const err = new Error(
      `Cannot find module '${moduleName}' from '${relativePath || '.'}'`,
    );
    (err               ).code = 'MODULE_NOT_FOUND';
    throw err;
  }

  isCoreModule(moduleName        )          {
    return this._options.hasCoreModules && isBuiltinModule(moduleName);
  }

  getModule(name        )        {
    return this._moduleMap.getModule(
      name,
      this._options.defaultPlatform,
      this._supportsNativePlatform(),
    );
  }

  getModulePath(from      , moduleName        ) {
    if (moduleName[0] !== '.' || path.isAbsolute(moduleName)) {
      return moduleName;
    }
    return path.normalize(path.dirname(from) + '/' + moduleName);
  }

  getPackage(name        )        {
    return this._moduleMap.getPackage(
      name,
      this._options.defaultPlatform,
      this._supportsNativePlatform(),
    );
  }

  getMockModule(from      , name        )        {
    const mock = this._moduleMap.getMockModule(name);
    if (mock) {
      return mock;
    } else {
      const moduleName = this._resolveStubModuleName(from, name);
      if (moduleName) {
        return this.getModule(moduleName) || moduleName;
      }
    }
    return null;
  }

  getModulePaths(from      )              {
    if (!this._modulePathCache[from]) {
      const moduleDirectory = this._options.moduleDirectories;
      const paths = nodeModulesPaths(from, {moduleDirectory});
      if (paths[paths.length - 1] === undefined) {
        // circumvent node-resolve bug that adds `undefined` as last item.
        paths.pop();
      }
      this._modulePathCache[from] = paths;
    }
    return this._modulePathCache[from];
  }

  getModuleID(
    virtualMocks               ,
    from      ,
    _moduleName          ,
  )         {
    const moduleName = _moduleName || '';

    const key = from + path.delimiter + moduleName;
    if (this._moduleIDCache[key]) {
      return this._moduleIDCache[key];
    }

    const moduleType = this._getModuleType(moduleName);
    const absolutePath = this._getAbsolutPath(virtualMocks, from, moduleName);
    const mockPath = this._getMockPath(from, moduleName);

    const sep = path.delimiter;
    const id =
      moduleType +
      sep +
      (absolutePath ? absolutePath + sep : '') +
      (mockPath ? mockPath + sep : '');

    return (this._moduleIDCache[key] = id);
  }

  _getModuleType(moduleName        )                  {
    return this.isCoreModule(moduleName) ? 'node' : 'user';
  }

  _getAbsolutPath(
    virtualMocks               ,
    from      ,
    moduleName        ,
  )          {
    if (this.isCoreModule(moduleName)) {
      return moduleName;
    }
    return this._isModuleResolved(from, moduleName)
      ? this.getModule(moduleName)
      : this._getVirtualMockPath(virtualMocks, from, moduleName);
  }

  _getMockPath(from      , moduleName        )          {
    return !this.isCoreModule(moduleName)
      ? this.getMockModule(from, moduleName)
      : null;
  }

  _getVirtualMockPath(
    virtualMocks               ,
    from      ,
    moduleName        ,
  )       {
    const virtualMockPath = this.getModulePath(from, moduleName);
    return virtualMocks[virtualMockPath]
      ? virtualMockPath
      : moduleName
        ? this.resolveModule(from, moduleName)
        : from;
  }

  _isModuleResolved(from      , moduleName        )          {
    return !!(
      this.getModule(moduleName) || this.getMockModule(from, moduleName)
    );
  }

  _resolveStubModuleName(from      , moduleName        )        {
    const dirname = path.dirname(from);
    const paths = this._options.modulePaths;
    const extensions = this._options.extensions;
    const moduleDirectory = this._options.moduleDirectories;
    const moduleNameMapper = this._options.moduleNameMapper;
    const resolver = this._options.resolver;

    if (moduleNameMapper) {
      for (const {moduleName: mappedModuleName, regex} of moduleNameMapper) {
        if (regex.test(moduleName)) {
          // Note: once a moduleNameMapper matches the name, it must result
          // in a module, or else an error is thrown.
          const matches = moduleName.match(regex);
          const updatedName = matches
            ? mappedModuleName.replace(
                /\$([0-9]+)/g,
                (_, index) => matches[parseInt(index, 10)],
              )
            : mappedModuleName;

          const module =
            this.getModule(updatedName) ||
            Resolver.findNodeModule(updatedName, {
              basedir: dirname,
              browser: this._options.browser,
              extensions,
              moduleDirectory,
              paths,
              resolver,
              rootDir: this._options.rootDir,
            });
          if (!module) {
            const error = new Error(
              chalk.red(`${chalk.bold('Configuration error')}:

Could not locate module ${chalk.bold(moduleName)} (mapped as ${chalk.bold(
                updatedName,
              )})

Please check:

"moduleNameMapper": {
  "${regex.toString()}": "${chalk.bold(mappedModuleName)}"
},
"resolver": ${chalk.bold(String(resolver))}`),
            );
            error.stack = '';
            throw error;
          }
          return module;
        }
      }
    }
    return null;
  }

  _supportsNativePlatform() {
    return (this._options.platforms || []).indexOf(NATIVE_PLATFORM) !== -1;
  }
}

module.exports = Resolver;
