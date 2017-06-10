const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

// const error = require('feathers-errors/handler');

const middleware = require('./middleware');
const services = require('./bootstrap');
const bootstrap = require('./services');
const appHooks = require('./app.hooks');

const authentication = require('./authentication');

const mongodb = require('./mongodb');

const restFormatter = require('./rest-formatter');

// const errorFormatter = require('./error-formatter');

const app = feathers();

// Load app configuration

app.configure(configuration(path.join(__dirname, '..')));

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(mongodb);
app.configure(rest(restFormatter));
app.configure(socketio());

app.configure(authentication);
app.use(function (req, res, next) {
  req.feathers.method = req.method;
  req.feathers.queries = req.query;
  next();
});

// Set up our services (see `services/index.js`)
app.configure(services);

//Need to bootstrap the application with a SAAS User
app.configure(bootstrap);

// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

module.exports = app;
