// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    if (hook.params.query.returnDeleted) return Promise.resolve(hook);

    if (hook.result.isDeleted) {
      hook.result.status = 404;
      return Promise.resolve(hook);
    }

    return Promise.resolve(hook);
  };
};
