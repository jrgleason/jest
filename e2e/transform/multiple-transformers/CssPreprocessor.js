/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  process() {
    return `
      module.exports = {
        root: 'App-root',
        header: 'App-header',
        logo: 'App-logo',
        intro: 'App-intro',
      };
    `;
  },
};
