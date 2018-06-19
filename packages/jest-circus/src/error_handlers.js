/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *       strict-local
 */

import {dispatch} from './state';
                                                      

const uncaught = (error       ) => {
  dispatch({error, name: 'error'});
};

export const injectGlobalErrorHandlers = (
  parentProcess         ,
)                      => {
  const uncaughtException = process.listeners('uncaughtException').slice();
  const unhandledRejection = process.listeners('unhandledRejection').slice();
  parentProcess.removeAllListeners('uncaughtException');
  parentProcess.removeAllListeners('unhandledRejection');
  parentProcess.on('uncaughtException', uncaught);
  parentProcess.on('unhandledRejection', uncaught);
  return {uncaughtException, unhandledRejection};
};

export const restoreGlobalErrorHandlers = (
  parentProcess         ,
  originalErrorHandlers                     ,
) => {
  parentProcess.removeListener('uncaughtException', uncaught);
  parentProcess.removeListener('unhandledRejection', uncaught);

  for (const listener of originalErrorHandlers.uncaughtException) {
    parentProcess.on('uncaughtException', listener);
  }
  for (const listener of originalErrorHandlers.unhandledRejection) {
    parentProcess.on('unhandledRejection', listener);
  }
};
