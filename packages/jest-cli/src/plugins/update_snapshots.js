/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */
                                               
                                                        
import {BaseWatchPlugin} from 'jest-watcher';

class UpdateSnapshotsPlugin extends BaseWatchPlugin {
                               
                   

  constructor(options   
                                            
                                              
   ) {
    super(options);
    this.isInternal = true;
  }

  run(
    globalConfig              ,
    updateConfigAndRun          ,
  )                   {
    updateConfigAndRun({updateSnapshot: 'all'});
    return Promise.resolve(false);
  }

  apply(hooks                    ) {
    hooks.onTestRunComplete(results => {
      this._hasSnapshotFailure = results.snapshot.failure;
    });
  }

  getUsageInfo(globalConfig              ) {
    if (this._hasSnapshotFailure) {
      return {
        key: 'u',
        prompt: 'update failing snapshots',
      };
    }

    return null;
  }
}

export default UpdateSnapshotsPlugin;
