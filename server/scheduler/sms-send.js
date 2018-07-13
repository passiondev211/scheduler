/** 
 * @Author: ludan luan <ludan.luan@hotmail.com>
 * to: {String} - user phone number
 * message: {String} - sms message
 * cb: {function} - callback function(error)
 * Reference link:
 *    http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
 */
const AWS = require('aws-sdk');

import config from '../config/environment';

export function sendSMS({ to, subject, message }, cb = () => {}) {
  AWS.config.update({
    accessKeyId: config.amazon_sns.accessKeyId,
    secretAccessKey: config.amazon_sns.secretAccessKey,
    region: config.amazon_sns.region,
  });

  const sns = new AWS.SNS();
  const params = {
    Message: message,
    Subject: subject,
    PhoneNumber: to,
  };

  sns.publish(params, function(err, data) {
    if (err) {
      return cb ? cb('error when send sms') : null;
    }

    return cb ? cb(null) : null;
  });
}
