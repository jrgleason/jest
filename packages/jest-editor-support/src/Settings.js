/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                   
import {spawn} from 'child_process';
import EventEmitter from 'events';
import {createProcess} from './Process';

// This class represents the the configuration of Jest's process
// we want to start with the defaults then override whatever they output
// the interface below can be used to show what we use, as currently the whole
// settings object will be in memory.

// Ideally anything you care about adding should have a default in
// the constructor see https://facebook.github.io/jest/docs/configuration.html
// for full deets

// For now, this is all we care about inside the config

                   

                             
                    
                         
  

                                                         

export default class Settings extends EventEmitter {
                                 
                                  
                   
                                
                        
                          
                    
                                 
                                 
                              
                             

  constructor(workspace                  , options          ) {
    super();
    this.workspace = workspace;
    this._createProcess = (options && options.createProcess) || createProcess;
    this.spawnOptions = {shell: options && options.shell};

    // Defaults for a Jest project
    this.settings = {
      testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
      testRegex: '(/__tests__/.*|\\.(test|spec))\\.jsx?$',
    };

    this.configs = [this.settings];
  }

  getConfigs(completed     ) {
    this.getConfigProcess = this._createProcess(
      this.workspace,
      ['--showConfig'],
      this.spawnOptions,
    );

    this.getConfigProcess.stdout.on('data', (data        ) => {
      const settings = JSON.parse(data.toString());
      this.jestVersionMajor = parseInt(settings.version.split('.').shift(), 10);
      this.configs =
        this.jestVersionMajor >= 21 ? settings.configs : [settings.config];
    });

    // They could have an older build of Jest which
    // would error with `--showConfig`
    this.getConfigProcess.on('close', () => {
      completed();
    });
  }

  getConfig(completed     , index         = 0) {
    this.getConfigs(() => {
      this.settings = this.configs[index];
      completed();
    });
  }
}
