/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                    

import exit from 'exit';
import fs from 'fs';
import generateEmptyCoverage from '../generate_empty_coverage';
                                                                     

                                   
                             
                        
             
   

                                   

// Make sure uncaught errors are logged before we exit.
process.on('uncaughtException', err => {
  console.error(err.stack);
  exit(1);
});

export function worker({
  config,
  globalConfig,
  path,
}                    )                        {
  return generateEmptyCoverage(
    fs.readFileSync(path, 'utf8'),
    path,
    globalConfig,
    config,
  );
}
