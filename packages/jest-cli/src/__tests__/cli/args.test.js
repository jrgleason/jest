/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import {check} from '../../cli/args';

describe('check', () => {
  it('returns true if the arguments are valid', () => {
    const argv = {};
    expect(check(argv)).toBe(true);
  });

  it('raises an exception if runInBand and maxWorkers are both specified', () => {
    const argv = {maxWorkers: 2, runInBand: true};
    expect(() => check(argv)).toThrow(
      'Both --runInBand and --maxWorkers were specified',
    );
  });

  it('raises an exception if onlyChanged and watchAll are both specified', () => {
    const argv = {onlyChanged: true, watchAll: true};
    expect(() => check(argv)).toThrow(
      'Both --onlyChanged and --watchAll were specified',
    );
  });

  it('raises an exception when lastCommit and watchAll are both specified', () => {
    const argv = {lastCommit: true, watchAll: true};
    expect(() => check(argv)).toThrow(
      'Both --lastCommit and --watchAll were specified',
    );
  });

  it('raises an exception if findRelatedTests is specified with no file paths', () => {
    const argv = {_: [], findRelatedTests: true};
    expect(() => check(argv)).toThrow(
      'The --findRelatedTests option requires file paths to be specified',
    );
  });

  it('raises an exception if maxWorkers is specified with no number', () => {
    const argv = {maxWorkers: undefined};
    expect(() => check(argv)).toThrow(
      'The --maxWorkers (-w) option requires a number to be specified',
    );
  });

  it('raises an exception if config is not a valid JSON string', () => {
    const argv = {config: 'x:1'};
    expect(() => check(argv)).toThrow(
      'The --config option requires a JSON string literal, or a file path with a .js or .json extension',
    );
  });
});
