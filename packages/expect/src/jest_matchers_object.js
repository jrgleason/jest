/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import {AsymmetricMatcher} from './asymmetric_matchers';
             
         
                 
                        
                        

// Global matchers object holds the list of available matchers and
// the state, that can hold matcher specific values that change over time.
const JEST_MATCHERS_OBJECT = Symbol.for('$$jest-matchers-object');

// Notes a built-in/internal Jest matcher.
// Jest may override the stack trace of Errors thrown by internal matchers.
export const INTERNAL_MATCHER_FLAG = Symbol.for('$$jest-internal-matcher');

if (!global[JEST_MATCHERS_OBJECT]) {
  Object.defineProperty(global, JEST_MATCHERS_OBJECT, {
    value: {
      matchers: Object.create(null),
      state: {
        assertionCalls: 0,
        expectedAssertionsNumber: null,
        isExpectingAssertions: false,
        suppressedErrors: [], // errors that are not thrown immediately.
      },
    },
  });
}

export const getState = () => global[JEST_MATCHERS_OBJECT].state;

export const setState = (state        ) => {
  Object.assign(global[JEST_MATCHERS_OBJECT].state, state);
};

export const getMatchers = () => global[JEST_MATCHERS_OBJECT].matchers;

export const setMatchers = (
  matchers                ,
  isInternal         ,
  expect        ,
) => {
  Object.keys(matchers).forEach(key => {
    const matcher = matchers[key];
    Object.defineProperty(matcher, INTERNAL_MATCHER_FLAG, {
      value: isInternal,
    });

    if (!isInternal) {
      // expect is defined

      class CustomMatcher extends AsymmetricMatcher {
                    

        constructor(sample     , inverse          = false) {
          super();
          this.sample = sample;
          this.inverse = inverse;
        }

        asymmetricMatch(other     ) {
          const {pass} = ((matcher(
            (other     ),
            (this.sample     ),
          )     )                       );

          return this.inverse ? !pass : pass;
        }

        toString() {
          return `${this.inverse ? 'not.' : ''}${key}`;
        }

        getExpectedType() {
          return 'any';
        }

        toAsymmetricMatcher() {
          return `${this.toString()}<${this.sample}>`;
        }
      }

      expect[key] = (sample     ) => new CustomMatcher(sample);
      if (!expect.not) {
        expect.not = {};
      }
      expect.not[key] = (sample     ) => new CustomMatcher(sample, true);
    }
  });

  Object.assign(global[JEST_MATCHERS_OBJECT].matchers, matchers);
};
