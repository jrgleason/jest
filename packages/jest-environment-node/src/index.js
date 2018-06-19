/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                               
                                                
                                         
                                            

import vm from 'vm';
import {FakeTimers, installCommonGlobals} from 'jest-util';
import mock from 'jest-mock';

               
             
                   
                     
   

class NodeEnvironment {
                       
                                 
                  
                              

  constructor(config               ) {
    this.context = vm.createContext();
    const global = (this.global = vm.runInContext(
      'this',
      Object.assign(this.context, config.testEnvironmentOptions),
    ));
    global.global = global;
    global.clearInterval = clearInterval;
    global.clearTimeout = clearTimeout;
    global.setInterval = setInterval;
    global.setTimeout = setTimeout;
    // URL and URLSearchParams are global in Node >= 10
    if (typeof URL !== 'undefined' && typeof URLSearchParams !== 'undefined') {
      /* global URL, URLSearchParams */
      global.URL = URL;
      global.URLSearchParams = URLSearchParams;
    }
    installCommonGlobals(global, config.globals);
    this.moduleMocker = new mock.ModuleMocker(global);

    const timerIdToRef = (id        ) => ({
      id,
      ref() {
        return this;
      },
      unref() {
        return this;
      },
    });

    const timerRefToId = (timer       )          => {
      return (timer && timer.id) || null;
    };

    const timerConfig = {
      idToRef: timerIdToRef,
      refToId: timerRefToId,
    };

    this.fakeTimers = new FakeTimers({
      config,
      global,
      moduleMocker: this.moduleMocker,
      timerConfig,
    });
  }

  setup()                {
    return Promise.resolve();
  }

  teardown()                {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }
    this.context = null;
    this.fakeTimers = null;
    return Promise.resolve();
  }

  // Disabling rule as return type depends on script's return type.
  /* eslint-disable flowtype/no-weak-types */
  runScript(script        )       {
    /* eslint-enable flowtype/no-weak-types */
    if (this.context) {
      return script.runInContext(this.context);
    }
    return null;
  }
}

module.exports = NodeEnvironment;
