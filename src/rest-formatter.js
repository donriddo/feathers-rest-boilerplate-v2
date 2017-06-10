module.exports = exports = function (req, res) {

  if (res.data.status) {
    switch (res.data.status) {
      case 404:
        return res.status(404).json({
          message: _.capitalize(res.req.url.split('/')[1]).concat(' not found'),
        });
      default:
        return res.json(res.data);
    }
  } else {
    return res.json(res.data);
  }

};
