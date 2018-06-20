/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                               

const config = {
  comment: '  A comment',
  condition: () => true,
  deprecate: () => false,
  deprecatedConfig: {
    key: () => {},
  },
  error: () => {},
  exampleConfig: {key: 'value', test: 'case'},
  title: {
    deprecation: 'Deprecation Warning',
    error: 'Validation Error',
    warning: 'Validation Warning',
  },
  unknown: () => {},
};

export default config;
