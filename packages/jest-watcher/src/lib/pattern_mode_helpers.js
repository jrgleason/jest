/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

'use strict';

import chalk from 'chalk';
import ansiEscapes from 'ansi-escapes';
import stringLength from 'string-length';

export const printPatternCaret = (
  pattern        ,
  pipe                                   ,
) => {
  const inputText = `${chalk.dim(' pattern \u203A')} ${pattern}`;

  pipe.write(ansiEscapes.eraseDown);
  pipe.write(inputText);
  pipe.write(ansiEscapes.cursorSavePosition);
};

export const printRestoredPatternCaret = (
  pattern        ,
  currentUsageRows        ,
  pipe                                   ,
) => {
  const inputText = `${chalk.dim(' pattern \u203A')} ${pattern}`;

  pipe.write(
    ansiEscapes.cursorTo(stringLength(inputText), currentUsageRows - 1),
  );
  pipe.write(ansiEscapes.cursorRestorePosition);
};
