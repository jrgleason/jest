/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
import Jasmine from 'jasmine';

let jasmine = new Jasmine();

test('DEFAULT_TIMEOUT_INTERVAL', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
  expect(true).toBe(true);
});
