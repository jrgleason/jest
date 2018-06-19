/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */
                                               
import {BaseWatchPlugin, Prompt} from 'jest-watcher';
import TestNamePatternPrompt from '../test_name_pattern_prompt';
import activeFilters from '../lib/active_filters_message';

class TestNamePatternPlugin extends BaseWatchPlugin {
                  
                   

  constructor(options   
                                            
                                              
   ) {
    super(options);
    this._prompt = new Prompt();
    this.isInternal = true;
  }

  getUsageInfo() {
    return {
      key: 't',
      prompt: 'filter by a test name regex pattern',
    };
  }

  onKey(key        ) {
    this._prompt.put(key);
  }

  run(globalConfig              , updateConfigAndRun          )                {
    return new Promise((res, rej) => {
      const testNamePatternPrompt = new TestNamePatternPrompt(
        this._stdout,
        this._prompt,
      );

      testNamePatternPrompt.run(
        (value        ) => {
          updateConfigAndRun({mode: 'watch', testNamePattern: value});
          res();
        },
        rej,
        {
          header: activeFilters(globalConfig),
        },
      );
    });
  }
}

export default TestNamePatternPlugin;
