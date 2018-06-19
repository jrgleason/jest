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
  expect.setState({
    expand: config.expand,
  });
  expect.extend({
    toMatchSnapshot,
    toThrowErrorMatchingSnapshot,
  });

  (expect        ).addSnapshotSerializer = addSerializer;
};
