// Copyright 2004-present Facebook. All Rights Reserved.

const lodash = jest.genMockFromModule('lodash');

lodash.head = () => 5;

export default lodash;
