/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                               
import {BaseWatchPlugin, Prompt} from 'jest-watcher';
import TestPathPatternPrompt from '../test_path_pattern_prompt';
import activeFilters from '../lib/active_filters_message';

class TestPathPatternPlugin extends BaseWatchPlugin {
                  
                   

  constructor(options   
                                            
                                              
   ) {
    super(options);
    this._prompt = new Prompt();
    this.isInternal = true;
  }

  getUsageInfo() {
    return {
      key: 'p',
      prompt: 'filter by a filename regex pattern',
    };
  }

  onKey(key        ) {
    this._prompt.put(key);
  }

  run(globalConfig              , updateConfigAndRun          )                {
    return new Promise((res, rej) => {
      const testPathPatternPrompt = new TestPathPatternPrompt(
        this._stdout,
        this._prompt,
      );

      testPathPatternPrompt.run(
        (value        ) => {
          updateConfigAndRun({mode: 'watch', testPathPattern: value});
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

export default TestPathPatternPlugin;
