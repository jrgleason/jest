/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                              

import {version as VERSION} from '../../package.json';

export default function logDebugMessages(
  globalConfig              ,
  configs                      ,
  outputStream                                   ,
)       {
  const output = {
    configs,
    globalConfig,
    version: VERSION,
  };
  outputStream.write(JSON.stringify(output, null, '  ') + '\n');
}
