/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                   
                                           
                                           
                                                            

import {remove as preRunMessageRemove} from '../pre_run_message';

export default class BaseReporter {
                 

  log(message        ) {
    process.stderr.write(message + '\n');
  }

  onRunStart() {
    preRunMessageRemove(process.stderr);
  }

  onTestResult(){}

  onTestStart(){}

  onRunComplete(){}

  _setError(error       ) {
    this._error = error;
  }

  // Return an error that occurred during reporting. This error will
  // define whether the test run was successful or failed.
  getLastError()         {
    return this._error;
  }
}
