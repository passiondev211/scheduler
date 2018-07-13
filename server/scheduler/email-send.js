const sgMail = require('@sendgrid/mail');

import config from '../config/environment';

sgMail.setApiKey(config.sendgrid.key);

/**
 * Send email notification to user
 */
export function sendNotification({ to, subject, html }, cb = () => {}) {
  const msg = {
    to,
    from: config.adminEmail,
    subject,
    html,
  };

  sgMail.send(msg, cb);
}
