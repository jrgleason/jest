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
  printPatternCaret,
  printRestoredPatternCaret,
} from 'jest-watcher';

export default class TestNamePatternPrompt extends PatternPrompt {
                                        

  constructor(pipe                                   , prompt        ) {
    super(pipe, prompt);
    this._entityName = 'tests';
    this._cachedTestResults = [];
  }

  _onChange(pattern        , options               ) {
    super._onChange(pattern, options);
    this._printPrompt(pattern, options);
  }

  _printPrompt(pattern) {
    const pipe = this._pipe;
    printPatternCaret(pattern, pipe);
    printRestoredPatternCaret(pattern, this._currentUsageRows, pipe);
  }

  _getMatchedTests(pattern        ) {
    let regex;

    try {
      regex = new RegExp(pattern, 'i');
    } catch (e) {
      return [];
    }

    const matchedTests = [];

    this._cachedTestResults.forEach(({testResults}) =>
      testResults.forEach(({title}) => {
        if (regex.test(title)) {
          matchedTests.push(title);
        }
      }),
    );

    return matchedTests;
  }

  updateCachedTestResults(testResults                    = []) {
    this._cachedTestResults = testResults;
  }
}
