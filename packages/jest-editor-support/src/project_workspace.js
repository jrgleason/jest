/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

/**
 * Represents the project that the extension is running on and it's state
 */
export default class ProjectWorkspace {
  /**
   * The path to the root of the project's workspace
   *
   * @type {string}
   */
                   

  /**
   * The path to Jest, this is normally a file path like
   * `node_modules/.bin/jest` but you should not make the assumption that
   * it is always a direct file path, as in a create-react app it would look
   * like `npm test --`.
   *
   * This means when launching a process, you will need to split on the first
   * space, and then move any other args into the args of the process.
   *
   * @type {string}
   */
                     

  /**
   * Path to a local Jest config file.
   *
   * @type {string}
   */
                       

  /**
   * local Jest major release version, as the runner could run against
   * any version of Jest.
   *
   * @type {number}
   */
                                

  /**
   * Whether test coverage should be (automatically) collected.
   *
   * @type {boolean}
   */
                            

  constructor(
    rootPath        ,
    pathToJest        ,
    pathToConfig        ,
    localJestMajorVersion        ,
    collectCoverage          ,
  ) {
    this.rootPath = rootPath;
    this.pathToJest = pathToJest;
    this.pathToConfig = pathToConfig;
    this.localJestMajorVersion = localJestMajorVersion;
    this.collectCoverage = collectCoverage;
  }
}
