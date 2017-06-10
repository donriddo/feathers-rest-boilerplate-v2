const _ = require('lodash');
module.exports = exports = function (err, req, res) {
  if (err) {
    switch (err.code) {
      case 400:
        if (err.message.indexOf('Cast to ObjectId failed') >= 0)
          return res.status(400).json({
            message: _.capitalize(res.req.url.split('/')[1]).concat(' not found'),
          });
        return res.status(400).json({
          message: 'Validation error has occured',
          error: err.data,
        });
      default:
        return res.status(err.code).json('err');
    }
  } else {
    return res.json(res.data);
  }

};
