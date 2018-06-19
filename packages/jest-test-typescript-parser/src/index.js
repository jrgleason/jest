/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import {parse as babylonParser} from 'jest-editor-support';
import * as TypeScriptParser from './type_script_parser';

                            
                           
                         
  

/**
 * Converts the file into an AST, then passes out a
 * collection of it and expects.
 */
function parse(file        )               {
  if (file.match(/\.tsx?$/)) {
    return TypeScriptParser.parse(file);
  } else {
    return babylonParser(file);
  }
}

module.exports = {
  TypeScriptParser,
  parse,
};
