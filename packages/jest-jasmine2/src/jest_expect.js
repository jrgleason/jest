/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                 

import expect from 'expect';
import {
  addSerializer,
  toMatchSnapshot,
  toThrowErrorMatchingSnapshot,
} from 'jest-snapshot';

                       
                                                    
                              
                                      
  
                                                            

export default (config                   ) => {
  global.expect = expect;
  expect.setState({expand: config.expand});
  expect.extend({
    toMatchSnapshot,
    toThrowErrorMatchingSnapshot,
  });
  (expect        ).addSnapshotSerializer = addSerializer;

  const jasmine = global.jasmine;
  jasmine.anything = expect.anything;
  jasmine.any = expect.any;
  jasmine.objectContaining = expect.objectContaining;
  jasmine.arrayContaining = expect.arrayContaining;
  jasmine.stringMatching = expect.stringMatching;

  jasmine.addMatchers = (jasmineMatchersObject                       ) => {
    const jestMatchersObject = Object.create(null);
    Object.keys(jasmineMatchersObject).forEach(name => {
      jestMatchersObject[name] = function()               {
        // use "expect.extend" if you need to use equality testers (via this.equal)
        const result = jasmineMatchersObject[name](null, null);
        // if there is no 'negativeCompare', both should be handled by `compare`
        const negativeCompare = result.negativeCompare || result.compare;

        return this.isNot
          ? negativeCompare.apply(null, arguments)
          : result.compare.apply(null, arguments);
      };
    });

    const expect = global.expect;
    expect.extend(jestMatchersObject);
  };
};
