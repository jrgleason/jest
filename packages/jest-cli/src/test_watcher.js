/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import EventEmitter from 'events';

               
                       
   

export default class TestWatcher extends EventEmitter {
               
                        

  constructor({isWatchMode}                        ) {
    super();
    this.state = {interrupted: false};
    this._isWatchMode = isWatchMode;
  }

  setState(state       ) {
    Object.assign(this.state, state);
    this.emit('change', this.state);
  }

  isInterrupted() {
    return this.state.interrupted;
  }

  isWatchMode() {
    return this._isWatchMode;
  }
}
