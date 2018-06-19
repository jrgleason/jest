/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                             
                                             

import path from 'path';
import micromatch from 'micromatch';
import H from './constants';

export default class HasteFS {
                   

  constructor(files          ) {
    this._files = files;
  }

  getModuleName(file      )          {
    return (this._files[file] && this._files[file][H.ID]) || null;
  }

  getDependencies(file      )                 {
    return (this._files[file] && this._files[file][H.DEPENDENCIES]) || null;
  }

  getSha1(file      )          {
    return (this._files[file] && this._files[file][H.SHA1]) || null;
  }

  exists(file      )          {
    return !!this._files[file];
  }

  getAllFiles()                {
    return Object.keys(this._files);
  }

  matchFiles(pattern                 )              {
    if (!(pattern instanceof RegExp)) {
      pattern = new RegExp(pattern);
    }
    const files = [];
    for (const file in this._files) {
      if (pattern.test(file)) {
        files.push(file);
      }
    }
    return files;
  }

  matchFilesWithGlob(globs             , root       )            {
    const files = new Set();
    for (const file in this._files) {
      const filePath = root ? path.relative(root, file) : file;
      if (micromatch([filePath], globs).length) {
        files.add(file);
      }
    }
    return files;
  }
}
