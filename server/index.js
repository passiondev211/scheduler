import express from 'express';
import mongoose from 'mongoose';
import winston from 'winston';
import http from 'http';
import { Nuxt, Builder } from 'nuxt';

import config from './config/environment';
import configureApp from './config/express';
import configureRoute from './routes';
import perMinSchedule from './scheduler';

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Setup server
const app = express();
const server = http.createServer(app);
configureApp(app);
configureRoute(app);

// Init Nuxt.js
let nuxtConfig;
if (process.env.NODE_ENV === 'production') {
  nuxtConfig = require('../../nuxt.config.js');
  nuxtConfig.dev = false;
} else {
  nuxtConfig = require('../nuxt.config.js');
  nuxtConfig.dev = true;
}

const nuxt = new Nuxt(nuxtConfig);
if (nuxtConfig.dev) {
  const builder = new Builder(nuxt);
  builder.build();
}
app.use(nuxt.render);

// Start server
server.listen(config.port, config.ip, () => {
  perMinSchedule();
  winston.info('Express server listening on %d, in %s mode', config.port, config.env);
});

export default app;
