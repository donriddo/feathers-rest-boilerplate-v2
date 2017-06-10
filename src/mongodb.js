const mongoose = require('mongoose');

module.exports = function () {

  const app = this;

  if (app.get('env') === 'test') {
    console.log(`We are using ${app.get('testdb')}`);
    mongoose.connect(app.get('testdb'));
  } else {
    mongoose.connect(app.get('mongodb'));
  }

  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
