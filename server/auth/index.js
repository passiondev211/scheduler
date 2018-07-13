import express from 'express';
import request from 'request-promise';

import auth from './auth.service';
import config from '../config/environment';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    // get token
    const body = {};
    body.username = req.body.username;
    body.password = req.body.password;

    let options = {
      method: 'POST',
      uri: `${config.apiEndpointBase}api/v1/api-token-auth`,
      body: body,
      json: true,
    };
    const token_resp = await request(options);

    // get seller information
    options = {
      method: 'GET',
      uri: `${config.apiEndpointBase}api/v1/user`,
      json: true,
      headers: {
        'Authorization': `Token ${token_resp.token}`
      },
    };
    const user_resp = await request(options);

    // save session & generate token (user + shoppe token)
    req.session.authUser = {
      shoppe_token: token_resp.token,
      profile: user_resp
    };

    return res.success(user_resp);
  } catch (err) {
    return res.error(err.error);
  }
});

router.post('/logout', function (req, res) {
  delete req.session.authUser;
  return res.success();
})

export default router;
