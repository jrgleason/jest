/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import {clearLine, isInteractive} from 'jest-util';

import chalk from 'chalk';

export const print = (stream                                   ) => {
  if (isInteractive) {
    stream.write(chalk.bold.dim('Determining test suites to run...'));
  }
};

export const remove = (stream                                   ) => {
  if (isInteractive) {
    clearLine(stream);
  }
};
