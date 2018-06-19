/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                               

import assert from 'assert';
import {format} from 'util';
import {Console} from 'console';
import chalk from 'chalk';
import clearLine from './clear_line';

                                                                

export default class CustomConsole extends Console {
                           
                           
                         
                     
                      

  constructor(
    stdout                 ,
    stderr                 ,
    formatBuffer            ,
  ) {
    super(stdout, stderr);
    this._formatBuffer = formatBuffer || ((type, message) => message);
    this._counters = {};
    this._timers = {};
    this._groupDepth = 0;
  }

  _logToParentConsole(message        ) {
    super.log(message);
  }

  _log(type         , message        ) {
    clearLine(this._stdout);
    this._logToParentConsole(
      this._formatBuffer(type, '  '.repeat(this._groupDepth) + message),
    );
  }

  assert(...args            ) {
    try {
      assert(...args);
    } catch (error) {
      this._log('assert', error.toString());
    }
  }

  count(label         = 'default') {
    if (!this._counters[label]) {
      this._counters[label] = 0;
    }

    this._log('count', format(`${label}: ${++this._counters[label]}`));
  }

  countReset(label         = 'default') {
    this._counters[label] = 0;
  }

  debug(...args            ) {
    this._log('debug', format(...args));
  }

  dir(...args            ) {
    this._log('dir', format(...args));
  }

  dirxml(...args            ) {
    this._log('dirxml', format(...args));
  }

  error(...args            ) {
    this._log('error', format(...args));
  }

  group(...args            ) {
    this._groupDepth++;

    if (args.length > 0) {
      this._log('group', chalk.bold(format(...args)));
    }
  }

  groupCollapsed(...args            ) {
    this._groupDepth++;

    if (args.length > 0) {
      this._log('groupCollapsed', chalk.bold(format(...args)));
    }
  }

  groupEnd() {
    if (this._groupDepth > 0) {
      this._groupDepth--;
    }
  }

  info(...args            ) {
    this._log('info', format(...args));
  }

  log(...args            ) {
    this._log('log', format(...args));
  }

  time(label         = 'default') {
    if (this._timers[label]) {
      return;
    }

    this._timers[label] = new Date();
  }

  timeEnd(label         = 'default') {
    const startTime = this._timers[label];

    if (startTime) {
      const endTime = new Date();
      const time = (endTime - startTime) / 1000;
      this._log('time', format(`${label}: ${time}ms`));
      delete this._timers[label];
    }
  }

  warn(...args            ) {
    this._log('warn', format(...args));
  }

  getBuffer() {
    return null;
  }
}
