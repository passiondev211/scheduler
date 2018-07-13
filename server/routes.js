/**
 * Main application routes
 */

import auth from './auth';
import api from './api';
import subscribe from './api/subscribe_form';
import middleware from './middleware';

export default (app) => {
  // middleware
  app.use(middleware);

  // Insert routes
  app.use('/subscribe', subscribe);
  app.use('/api/auth', auth);
  app.use('/api', api);
};
