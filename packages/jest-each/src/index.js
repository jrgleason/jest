/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import bind from './bind';

                        
                                            
                                             
                                          
                                           
                                           
                                                
                                                 
                                                 
  

const install = (g                 , ...args              ) => {
  const test = (title        , test          ) =>
    bind(g.test)(...args)(title, test);
  test.skip = bind(g.test.skip)(...args);
  test.only = bind(g.test.only)(...args);

  const it = (title        , test          ) =>
    bind(g.it)(...args)(title, test);
  it.skip = bind(g.it.skip)(...args);
  it.only = bind(g.it.only)(...args);

  const xit = bind(g.xit)(...args);
  const fit = bind(g.fit)(...args);
  const xtest = bind(g.xtest)(...args);

  const describe = (title        , suite          ) =>
    bind(g.describe)(...args)(title, suite);
  describe.skip = bind(g.describe.skip)(...args);
  describe.only = bind(g.describe.only)(...args);
  const fdescribe = bind(g.fdescribe)(...args);
  const xdescribe = bind(g.xdescribe)(...args);

  return {describe, fdescribe, fit, it, test, xdescribe, xit, xtest};
};

const each = (...args              ) => install(global, ...args);

each.withGlobal = (g                 ) => (...args              ) =>
  install(g, ...args);

export {bind};

export default each;
