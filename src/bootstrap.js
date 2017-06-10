'use strict';
const Setup = require('./models/setup.model');
module.exports = function () {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this;
  const SAAS = {
    email: 'saas@sellingpoint.co',
    password: 'saas@sps3cr37',
    role: 'saas',
  };

  global._ = require('lodash');

  function initializeSetup() {
    app.service('user').create(SAAS).then(saas => {
      console.log('SAAS User initialized successfully: ', saas.role);
      return Setup.create({ initialized: true });
    }).then(setup => {
      console.log('Application setup successfully: ', setup.initialized);
      return setup;
    }).catch(err => console.log(err));

  }

  Setup.findOne({ initialized: true }).then(setup => {
    if (!setup) return initializeSetup();
    return setup;
  }).then(setup => {
    console.log('Application successfully loaded: ', setup);
  }).catch(err => console.log(err));

};
