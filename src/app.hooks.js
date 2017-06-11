// Application hooks that run for every service
// const logger = require('./hooks/logger');
const filterDelete = require('./hooks/filter-delete');
const setUpdatedAt = require('./hooks/set-updated-at');
const softDelete = require('./hooks/soft-delete');

module.exports = {

  before: {
    all: [softDelete()],
    find: [],
    get: [],
    create: [],
    update: [setUpdatedAt()],
    patch: [setUpdatedAt()],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [filterDelete()],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
