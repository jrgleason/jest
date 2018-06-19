/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */
                                               
                                                        
                                                    

class BaseWatchPlugin                        {
                                           
                                             
  constructor({
    stdin,
    stdout,
  }   
                                            
                                              
   ) {
    this._stdin = stdin;
    this._stdout = stdout;
  }

  apply() {}

  getUsageInfo(){
    return null;
  }

  onKey() {}

  run()                          {
    return Promise.resolve();
  }
}

export default BaseWatchPlugin;
