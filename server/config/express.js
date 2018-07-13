import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import path from 'path';
import winston from 'winston';
import expressWinston from 'express-winston';
import session from 'express-session';

const MongoStore = require('connect-mongo')(session);

import config from './environment';

export default (app) => {
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(session({
    cookie: {
      maxAge: config.secrets.sessionExpires
    },
    store: new MongoStore({ url: config.mongo.uri }),
    secret: config.secrets.session,
    resave: false,
    saveUninitialized: true
  }));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(express.static(path.join(config.root, 'static')));

  // CORS protection
  app.use((req, res, next) => {
    // CORS header
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });
};
