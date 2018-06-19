/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                               

import prettyFormat from 'pretty-format';
import jestMockSerializer from './mock_serializer';

const {
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent,
  AsymmetricMatcher,
} = prettyFormat.plugins;

let PLUGINS                = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  jestMockSerializer,
  AsymmetricMatcher,
];

// Prepend to list so the last added is the first tested.
export const addSerializer = (plugin        ) => {
  PLUGINS = [plugin].concat(PLUGINS);
};

export const getSerializers = () => PLUGINS;
