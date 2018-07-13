/**
 * Reference Guide
 * https://www.npmjs.com/package/fb
 * https://developers.facebook.com/docs/pages/access-tokens
 * https://developers.facebook.com/docs/messenger-platform/reference/send-api/
 */
const FB = require('fb');

import config from '../config/environment';

FB.options(config.facebook.options);
FB.setAccessToken(config.facebook.userAccessToken);

/**
 * Send facebook message to user
 */
export function sendFBMessage({ to, message }, cb = () => {}) {
  FB.api(`${config.facebook.pageId}?fields=access_token`, 'get', res => {
    if (!res || res.error) {
      if (cb) {
        return cb(res.error);
      }

      return;
    }

    FB.api(`me/messages?access_token=${res.access_token}`, 'post', {
      'messaging_type': 'UPDATE',
      'recipient': {
        'id': to
      },
      'message': {
        'text': message
      }
    }, res => {
      if (!res || res.error) {
        if (cb) {
          return cb(res.error);
        }

        return;
      }

      if (cb) {
        return cb(null);
      }
    });
  });
}
