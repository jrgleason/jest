/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                         

import {printListItems, printObjectProperties} from '../collections';

const asymmetricMatcher = Symbol.for('jest.asymmetricMatcher');
const SPACE = ' ';

export const serialize = (
  val     ,
  config        ,
  indentation        ,
  depth        ,
  refs      ,
  printer         ,
)         => {
  const stringedValue = val.toString();

  if (
    stringedValue === 'ArrayContaining' ||
    stringedValue === 'ArrayNotContaining'
  ) {
    if (++depth > config.maxDepth) {
      return '[' + stringedValue + ']';
    }
    return (
      stringedValue +
      SPACE +
      '[' +
      printListItems(val.sample, config, indentation, depth, refs, printer) +
      ']'
    );
  }

  if (
    stringedValue === 'ObjectContaining' ||
    stringedValue === 'ObjectNotContaining'
  ) {
    if (++depth > config.maxDepth) {
      return '[' + stringedValue + ']';
    }
    return (
      stringedValue +
      SPACE +
      '{' +
      printObjectProperties(
        val.sample,
        config,
        indentation,
        depth,
        refs,
        printer,
      ) +
      '}'
    );
  }

  if (
    stringedValue === 'StringMatching' ||
    stringedValue === 'StringNotMatching'
  ) {
    return (
      stringedValue +
      SPACE +
      printer(val.sample, config, indentation, depth, refs)
    );
  }

  if (
    stringedValue === 'StringContaining' ||
    stringedValue === 'StringNotContaining'
  ) {
    return (
      stringedValue +
      SPACE +
      printer(val.sample, config, indentation, depth, refs)
    );
  }

  return val.toAsymmetricMatcher();
};

export const test = (val     ) => val && val.$$typeof === asymmetricMatcher;

export default ({serialize, test}           );
