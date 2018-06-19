/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                           
                                           
                                               
                                                

import {
  PatternPrompt,
  Prompt,
  printPatternCaret,
  printRestoredPatternCaret,
} from 'jest-watcher';

                             
                   
                             
    

export default class TestPathPatternPrompt extends PatternPrompt {
                                

  constructor(pipe                                   , prompt        ) {
    super(pipe, prompt);
    this._entityName = 'filenames';
  }

  _onChange(pattern        , options               ) {
    super._onChange(pattern, options);
    this._printPrompt(pattern, options);
  }

  _printPrompt(pattern        , options               ) {
    const pipe = this._pipe;
    printPatternCaret(pattern, pipe);
    printRestoredPatternCaret(pattern, this._currentUsageRows, pipe);
  }

  _getMatchedTests(pattern        )              {
    let regex;

    try {
      regex = new RegExp(pattern, 'i');
    } catch (e) {}

    let tests = [];
    if (regex) {
      this._searchSources.forEach(({searchSource, context}) => {
        tests = tests.concat(searchSource.findMatchingTests(pattern).tests);
      });
    }

    return tests;
  }

  updateSearchSources(searchSources               ) {
    this._searchSources = searchSources;
  }
}
