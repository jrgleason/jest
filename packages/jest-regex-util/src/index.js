/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import path from 'path';

export const escapePathForRegex = (dir        ) => {
  if (path.sep === '\\') {
    // Replace "\" with "/" so it's not escaped by escapeStrForRegex.
    // replacePathSepForRegex will convert it back.
    dir = dir.replace(/\\/g, '/');
  }
  return replacePathSepForRegex(escapeStrForRegex(dir));
};

export const escapeStrForRegex = (string        ) =>
  string.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');

export const replacePathSepForRegex = (string        ) => {
  if (path.sep === '\\') {
    return string.replace(/(\/|\\(?![[\]{}()*+?.^$|]))/g, '\\\\');
  }
  return string;
};
