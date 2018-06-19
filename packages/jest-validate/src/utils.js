/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import chalk from 'chalk';
import prettyFormat from 'pretty-format';
import leven from 'leven';

const BULLET         = chalk.bold('\u25cf');
export const DEPRECATION = `${BULLET} Deprecation Warning`;
export const ERROR = `${BULLET} Validation Error`;
export const WARNING = `${BULLET} Validation Warning`;

export const format = (value     )         =>
  typeof value === 'function'
    ? value.toString()
    : prettyFormat(value, {min: true});

export class ValidationError extends Error {
               
                  

  constructor(name        , message        , comment         ) {
    super();
    comment = comment ? '\n\n' + comment : '\n';
    this.name = '';
    this.message = chalk.red(chalk.bold(name) + ':\n\n' + message + comment);
    Error.captureStackTrace(this, () => {});
  }
}

export const logValidationWarning = (
  name        ,
  message        ,
  comment          ,
) => {
  comment = comment ? '\n\n' + comment : '\n';
  console.warn(chalk.yellow(chalk.bold(name) + ':\n\n' + message + comment));
};

export const createDidYouMeanMessage = (
  unrecognized        ,
  allowedOptions               ,
) => {
  const suggestion = allowedOptions.find(option => {
    const steps         = leven(option, unrecognized);
    return steps < 3;
  });

  return suggestion ? `Did you mean ${chalk.bold(format(suggestion))}?` : '';
};
