/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *       strict-local
 */

                                                   
                                                              
                                                 
                                        

const FRAMEWORK_INITIALIZER = require.resolve('./jest_adapter_init');
import path from 'path';

const jestAdapter = async (
  globalConfig              ,
  config               ,
  environment             ,
  runtime         ,
  testPath        ,
)                      => {
  const {
    initialize,
    runAndTransformResultsToJestFormat,
  } = runtime.requireInternalModule(FRAMEWORK_INITIALIZER);

  runtime
    .requireInternalModule(path.resolve(__dirname, './jest_expect.js'))
    .default({
      expand: globalConfig.expand,
    });

  const {globals, snapshotState} = initialize({
    config,
    globalConfig,
    localRequire: runtime.requireModule.bind(runtime),
    parentProcess: process,
    testPath,
  });

  if (config.timers === 'fake') {
    environment.fakeTimers.useFakeTimers();
  }

  globals.beforeEach(() => {
    if (config.resetModules) {
      runtime.resetModules();
    }

    if (config.clearMocks) {
      runtime.clearAllMocks();
    }

    if (config.resetMocks) {
      runtime.resetAllMocks();

      if (config.timers === 'fake') {
        environment.fakeTimers.useFakeTimers();
      }
    }

    if (config.restoreMocks) {
      runtime.restoreAllMocks();
    }
  });

  if (config.setupTestFrameworkScriptFile) {
    runtime.requireModule(config.setupTestFrameworkScriptFile);
  }

  runtime.requireModule(testPath);
  const results = await runAndTransformResultsToJestFormat({
    config,
    globalConfig,
    testPath,
  });
  return _addSnapshotData(results, snapshotState);
};

const _addSnapshotData = (results            , snapshotState) => {
  results.testResults.forEach(({fullName, status}) => {
    if (status === 'pending' || status === 'failed') {
      // if test is skipped or failed, we don't want to mark
      // its snapshots as obsolete.
      snapshotState.markSnapshotsAsCheckedForTest(fullName);
    }
  });

  const uncheckedCount = snapshotState.getUncheckedCount();
  const uncheckedKeys = snapshotState.getUncheckedKeys();
  if (uncheckedCount) {
    snapshotState.removeUncheckedKeys();
  }

  const status = snapshotState.save();
  results.snapshot.fileDeleted = status.deleted;
  results.snapshot.added = snapshotState.added;
  results.snapshot.matched = snapshotState.matched;
  results.snapshot.unmatched = snapshotState.unmatched;
  results.snapshot.updated = snapshotState.updated;
  results.snapshot.unchecked = !status.deleted ? uncheckedCount : 0;
  // Copy the array to prevent memory leaks
  results.snapshot.uncheckedKeys = Array.from(uncheckedKeys);
  return results;
};

module.exports = jestAdapter;
