/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                
                                          
                                       
                          
                             
                 
  

                 
                          
                           
                     
                                                              
             
                                      
                               
                             
  

// Try getting the real promise object from the context, if available. Someone
// could have overridden it in a test. Async functions return it implicitly.
// eslint-disable-next-line no-unused-vars
const Promise = global[Symbol.for('jest-native-promise')] || global.Promise;

export default function treeProcessor(options         ) {
  const {
    nodeComplete,
    nodeStart,
    queueRunnerFactory,
    runnableIds,
    tree,
  } = options;

  function isEnabled(node, parentEnabled) {
    return parentEnabled || runnableIds.indexOf(node.id) !== -1;
  }

  function getNodeHandler(node          , parentEnabled         ) {
    const enabled = isEnabled(node, parentEnabled);
    return node.children
      ? getNodeWithChildrenHandler(node, enabled)
      : getNodeWithoutChildrenHandler(node, enabled);
  }

  function getNodeWithoutChildrenHandler(node          , enabled         ) {
    return function fn(done                        = () => {}) {
      node.execute(done, enabled);
    };
  }

  function getNodeWithChildrenHandler(node          , enabled         ) {
    return async function fn(done                        = () => {}) {
      nodeStart(node);
      await queueRunnerFactory({
        onException: error => node.onException(error),
        queueableFns: wrapChildren(node, enabled),
        userContext: node.sharedUserContext(),
      });
      nodeComplete(node);
      done();
    };
  }

  function hasEnabledTest(node          ) {
    if (node.children) {
      if (node.children.some(hasEnabledTest)) {
        return true;
      }
    } else {
      return !node.disabled;
    }
    return false;
  }

  function wrapChildren(node          , enabled         ) {
    if (!node.children) {
      throw new Error('`node.children` is not defined.');
    }
    const children = node.children.map(child => ({
      fn: getNodeHandler(child, enabled),
    }));
    if (!hasEnabledTest(node)) {
      return [];
    }
    return node.beforeAllFns.concat(children).concat(node.afterAllFns);
  }

  const treeHandler = getNodeHandler(tree, false);
  return treeHandler();
}
