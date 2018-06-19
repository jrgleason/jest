/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                             

import path from 'path';
import {ValidationError} from 'jest-validate';
import Resolver from 'jest-resolve';
import chalk from 'chalk';
export const BULLET         = chalk.bold('\u25cf ');
export const DOCUMENTATION_NOTE = `  ${chalk.bold(
  'Configuration Documentation:',
)}
  https://facebook.github.io/jest/docs/configuration.html
`;

const createValidationError = (message        ) => {
  return new ValidationError(
    `${BULLET}Validation Error`,
    message,
    DOCUMENTATION_NOTE,
  );
};

export const resolve = (
  resolver         ,
  rootDir        ,
  key        ,
  filePath      ,
) => {
  const module = Resolver.findNodeModule(
    replaceRootDirInPath(rootDir, filePath),
    {
      basedir: rootDir,
      resolver,
    },
  );

  if (!module) {
    throw createValidationError(
      `  Module ${chalk.bold(filePath)} in the ${chalk.bold(
        key,
      )} option was not found.
         ${chalk.bold('<rootDir>')} is: ${rootDir}`,
    );
  }

  return module;
};

export const escapeGlobCharacters = (path      )       => {
  return path.replace(/([()*{}\[\]!?\\])/g, '\\$1');
};

export const replaceRootDirInPath = (
  rootDir        ,
  filePath      ,
)         => {
  if (!/^<rootDir>/.test(filePath)) {
    return filePath;
  }

  return path.resolve(
    rootDir,
    path.normalize('./' + filePath.substr('<rootDir>'.length)),
  );
};

const _replaceRootDirInObject = (rootDir        , config     )         => {
  if (config !== null) {
    const newConfig = {};
    for (const configKey in config) {
      newConfig[configKey] =
        configKey === 'rootDir'
          ? config[configKey]
          : _replaceRootDirTags(rootDir, config[configKey]);
    }
    return newConfig;
  }
  return config;
};

export const _replaceRootDirTags = (rootDir        , config     ) => {
  switch (typeof config) {
    case 'object':
      if (Array.isArray(config)) {
        return config.map(item => _replaceRootDirTags(rootDir, item));
      }
      if (config instanceof RegExp) {
        return config;
      }
      return _replaceRootDirInObject(rootDir, config);
    case 'string':
      return replaceRootDirInPath(rootDir, config);
  }
  return config;
};

/**
 * Finds the test environment to use:
 *
 * 1. looks for jest-environment-<name> relative to project.
 * 1. looks for jest-environment-<name> relative to Jest.
 * 1. looks for <name> relative to project.
 * 1. looks for <name> relative to Jest.
 */
export const getTestEnvironment = (config        ) => {
  const env = replaceRootDirInPath(config.rootDir, config.testEnvironment);
  let module = Resolver.findNodeModule(`jest-environment-${env}`, {
    basedir: config.rootDir,
  });
  if (module) {
    return module;
  }

  try {
    return require.resolve(`jest-environment-${env}`);
  } catch (e) {}

  module = Resolver.findNodeModule(env, {basedir: config.rootDir});
  if (module) {
    return module;
  }

  try {
    return require.resolve(env);
  } catch (e) {}

  throw createValidationError(
    `  Test environment ${chalk.bold(
      env,
    )} cannot be found. Make sure the ${chalk.bold(
      'testEnvironment',
    )} configuration option points to an existing node module.`,
  );
};

export const isJSONString = (text         ) =>
  text &&
  typeof text === 'string' &&
  text.startsWith('{') &&
  text.endsWith('}');
