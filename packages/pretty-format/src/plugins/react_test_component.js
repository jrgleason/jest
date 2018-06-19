/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

             
         
          
            
                  
       
                            

import {
  printChildren,
  printElement,
  printElementAsLeaf,
  printProps,
} from './lib/markup';

const testSymbol = Symbol.for('react.test.json');

const getPropKeys = object => {
  const {props} = object;

  return props
    ? Object.keys(props)
        .filter(key => props[key] !== undefined)
        .sort()
    : [];
};

export const serialize = (
  object                 ,
  config        ,
  indentation        ,
  depth        ,
  refs      ,
  printer         ,
)         =>
  ++depth > config.maxDepth
    ? printElementAsLeaf(object.type, config)
    : printElement(
        object.type,
        object.props
          ? printProps(
              getPropKeys(object),
              // Despite ternary expression, Flow 0.51.0 found incorrect error:
              // undefined is incompatible with the expected param type of Object
              // $FlowFixMe
              object.props,
              config,
              indentation + config.indent,
              depth,
              refs,
              printer,
            )
          : '',
        object.children
          ? printChildren(
              object.children,
              config,
              indentation + config.indent,
              depth,
              refs,
              printer,
            )
          : '',
        config,
        indentation,
      );

export const test = (val     ) => val && val.$$typeof === testSymbol;

export default ({serialize, test}           );
