/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                               
                                                       
                                           

import exit from 'exit';
import path from 'path';
import util from 'util';
import notifier from 'node-notifier';
import BaseReporter from './base_reporter';
                                                            

const isDarwin = process.platform === 'darwin';

const icon = path.resolve(__dirname, '../assets/jest_logo.png');

export default class NotifyReporter extends BaseReporter {
                                               
                              
                                 
  constructor(
    globalConfig              ,
    startRun                                   ,
    context                      ,
  ) {
    super();
    this._globalConfig = globalConfig;
    this._startRun = startRun;
    this._context = context;
  }

  onRunComplete(contexts              , result                  )       {
    const success =
      result.numFailedTests === 0 && result.numRuntimeErrorTestSuites === 0;

    const notifyMode = this._globalConfig.notifyMode;
    const statusChanged =
      this._context.previousSuccess !== success || this._context.firstRun;
    if (
      success &&
      (notifyMode === 'always' ||
        notifyMode === 'success' ||
        notifyMode === 'success-change' ||
        (notifyMode === 'change' && statusChanged) ||
        (notifyMode === 'failure-change' && statusChanged))
    ) {
      const title = util.format('%d%% Passed', 100);
      const message = util.format(
        (isDarwin ? '\u2705 ' : '') + '%d tests passed',
        result.numPassedTests,
      );

      notifier.notify({icon, message, title});
    } else if (
      !success &&
      (notifyMode === 'always' ||
        notifyMode === 'failure' ||
        notifyMode === 'failure-change' ||
        (notifyMode === 'change' && statusChanged) ||
        (notifyMode === 'success-change' && statusChanged))
    ) {
      const failed = result.numFailedTests / result.numTotalTests;

      const title = util.format(
        '%d%% Failed',
        Math.ceil(Number.isNaN(failed) ? 0 : failed * 100),
      );
      const message = util.format(
        (isDarwin ? '\u26D4\uFE0F ' : '') + '%d of %d tests failed',
        result.numFailedTests,
        result.numTotalTests,
      );

      const watchMode = this._globalConfig.watch || this._globalConfig.watchAll;
      const restartAnswer = 'Run again';
      const quitAnswer = 'Exit tests';

      if (!watchMode) {
        notifier.notify({
          icon,
          message,
          title,
        });
      } else {
        notifier.notify(
          {
            actions: [restartAnswer, quitAnswer],
            closeLabel: 'Close',
            icon,
            message,
            title,
          },
          (err, _, metadata) => {
            if (err || !metadata) {
              return;
            }
            if (metadata.activationValue === quitAnswer) {
              exit(0);
              return;
            }
            if (metadata.activationValue === restartAnswer) {
              this._startRun(this._globalConfig);
            }
          },
        );
      }
    }

    this._context.previousSuccess = success;
    this._context.firstRun = false;
  }
}
