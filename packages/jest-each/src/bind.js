/**
 * Copyright (c) 2018-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import util from 'util';
import chalk from 'chalk';
import pretty from 'pretty-format';

                               
                   
                     
                
  

const EXPECTED_COLOR = chalk.green;
const RECEIVED_COLOR = chalk.red;
const SUPPORTED_PLACEHOLDERS = /%[sdifjoOp%]/g;
const PRETTY_PLACEHOLDER = '%p';

export default (cb          ) => (...args     ) =>
  function eachBind(title        , test          )       {
    if (args.length === 1) {
      const table        = args[0].every(Array.isArray)
        ? args[0]
        : args[0].map(entry => [entry]);
      return table.forEach(row =>
        cb(arrayFormat(title, ...row), applyRestParams(row, test)),
      );
    }

    const templateStrings = args[0];
    const data = args.slice(1);

    const keys = getHeadingKeys(templateStrings[0]);
    const table = buildTable(data, keys.length, keys);

    const missingData = data.length % keys.length;

    if (missingData > 0) {
      const error = new Error(
        'Not enough arguments supplied for given headings:\n' +
          EXPECTED_COLOR(keys.join(' | ')) +
          '\n\n' +
          'Received:\n' +
          RECEIVED_COLOR(pretty(data)) +
          '\n\n' +
          `Missing ${RECEIVED_COLOR(missingData.toString())} ${pluralize(
            'argument',
            missingData,
          )}`,
      );

      if (Error.captureStackTrace) {
        Error.captureStackTrace(error, eachBind);
      }

      return cb(title, () => {
        throw error;
      });
    }

    return table.forEach(row =>
      cb(interpolate(title, row), applyObjectParams(row, test)),
    );
  };

const getPrettyIndexes = placeholders =>
  placeholders.reduce(
    (indexes, placeholder, index) =>
      placeholder === PRETTY_PLACEHOLDER ? indexes.concat(index) : indexes,
    [],
  );

const arrayFormat = (title, ...args) => {
  const placeholders = title.match(SUPPORTED_PLACEHOLDERS) || [];
  const prettyIndexes = getPrettyIndexes(placeholders);

  const {title: prettyTitle, args: remainingArgs} = args.reduce(
    (acc            , arg, index) => {
      if (prettyIndexes.indexOf(index) !== -1) {
        return {
          args: acc.args,
          title: acc.title.replace(
            PRETTY_PLACEHOLDER,
            pretty(arg, {maxDepth: 1, min: true}),
          ),
        };
      }

      return {
        args: acc.args.concat([arg]),
        title: acc.title,
      };
    },
    {args: [], title},
  );

  return util.format(
    prettyTitle,
    ...remainingArgs.slice(0, placeholders.length - prettyIndexes.length),
  );
};

const applyRestParams = (params            , test          ) => {
  if (params.length < test.length) return done => test(...params, done);

  return () => test(...params);
};

const getHeadingKeys = (headings        )                =>
  headings.replace(/\s/g, '').split('|');

const buildTable = (
  data            ,
  rowSize        ,
  keys               ,
)             =>
  Array.from({length: data.length / rowSize})
    .map((_, index) => data.slice(index * rowSize, index * rowSize + rowSize))
    .map(row =>
      row.reduce(
        (acc, value, index) => Object.assign({}, acc, {[keys[index]]: value}),
        {},
      ),
    );

const interpolate = (title        , data     ) =>
  Object.keys(data).reduce(
    (acc, key) =>
      acc.replace('$' + key, pretty(data[key], {maxDepth: 1, min: true})),
    title,
  );

const applyObjectParams = (obj     , test          ) => {
  if (test.length > 1) return done => test(obj, done);

  return () => test(obj);
};

const pluralize = (word        , count        ) =>
  word + (count === 1 ? '' : 's');
