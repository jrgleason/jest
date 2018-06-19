/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                               

import {logValidationWarning, DEPRECATION} from './utils';

const deprecationMessage = (message        , options                   ) => {
  const comment = options.comment;
  const name = (options.title && options.title.deprecation) || DEPRECATION;

  logValidationWarning(name, message, comment);
};

export const deprecationWarning = (
  config        ,
  option        ,
  deprecatedOptions        ,
  options                   ,
)          => {
  if (option in deprecatedOptions) {
    deprecationMessage(deprecatedOptions[option](config), options);

    return true;
  }

  return false;
};
