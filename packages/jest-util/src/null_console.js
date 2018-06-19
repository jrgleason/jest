/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import Console from './Console';

export default class NullConsole extends Console {
  assert() {}
  debug() {}
  dir() {}
  error() {}
  info() {}
  log() {}
  time() {}
  timeEnd() {}
  trace() {}
  warn() {}
}
