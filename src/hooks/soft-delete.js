// Use this hook to manipulate incoming or outgoing user.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    switch (hook.method) {

      case 'find':
        if (_.isEmpty(hook.params.query) && !hook.params.authenticated) {

          hook.params.query = Object.assign(hook.params.query, { isDeleted: false });
          return hook;
        } else if (hook.params.query && hook.params.query.returnDeleted) {
          delete hook.params.query.isDeleted;
          delete hook.params.query.returnDeleted;
          return hook;
        } else {
          return hook;
        }

      case 'patch':
        if (hook.params.query && hook.params.query.updateDeleted) {
          return hook.service.get(hook.id).then(data => {
            let q = Object.assign(data, hook.data);
            return hook.service.update(hook.id, q);
          }).then(() => hook);
        } else {
          return hook;
        }

      case 'remove':
        hook.params.query = Object.assign({}, hook.params.query, { isDeleted: false });
        return hook.service.patch(hook.id, { isDeleted: true }, hook.params).then(() => hook);
      default:
        return hook;

    }
  };
};
