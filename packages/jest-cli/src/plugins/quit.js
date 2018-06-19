/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */
import {BaseWatchPlugin} from 'jest-watcher';

class QuitPlugin extends BaseWatchPlugin {
                   

  constructor(options   
                                            
                                              
   ) {
    super(options);
    this.isInternal = true;
  }

  async run() {
    if (typeof this._stdin.setRawMode === 'function') {
      this._stdin.setRawMode(false);
    }
    this._stdout.write('\n');
    process.exit(0);
  }

  getUsageInfo() {
    return {
      key: 'q',
      prompt: 'quit watch mode',
    };
  }
}

export default QuitPlugin;
