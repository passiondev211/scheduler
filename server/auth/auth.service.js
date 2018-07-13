import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';

import config from '../config/environment';

const validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * returns a jwt token signed by the app secret
 */
function signToken(data) {
  return jwt.sign(
    data,
    config.secrets.session,
    { expiresIn: 5 * 60 * 60 },
  );
}

/**
 * attaches the user information to the request if authenticated
 */
function isAuthenticated() {
  return compose()
    .use((req, res, next) => {
      if (req.session.authUser) {
        req.user = req.session.authUser;
        next();
      }
      else {
        res.sendStatus(403);
      }
    });
}

/**
 * checks if the user is a seller
 */
function isSeller() {
  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      if (req.user.profile.seller) {
        next();
      }
      else {
        res.sendStatus(403);
      }
    });
}

export default {
  isAuthenticated,
  signToken,
  isSeller,
};
