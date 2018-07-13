import schedule from 'node-schedule';
import _ from 'lodash';

import { sendNotification } from './email-send';
import { sendSMS } from './sms-send';
import { sendFBMessage } from './fb-send';
import { EventQueue, EventMessage } from '../api/event/event.model';
import { Subscriber } from '../api/subscriber/subscriber.model';

const eventNotificationHandler = async function() {
  try {
    const events = await EventQueue.find({
      'event_messages.is_sent': false,
      'event_messages._start': { $lt: new Date() }
    });

    _.each(events, async event => {
      const subscribers = await Subscriber.find({
        'workflow_id': event.workflow_id,
      });

      /**
       * filter pending event notifications first
       * process each pending event notification next
       */
      _.each(_.filter(event.event_messages, v => {
          return !v.is_sent && (v._start <= (new Date()));
        }), v => {
          // v.type is one of 'email', 'sms', 'facebook_messenger'
          switch (v.type) {
            case 'email':
              _.each(subscribers, user => {
                sendNotification({
                  to: user.email,
                  subject: 'From Shoppe',
                  html: v.message,
                });
              });

              v.is_sent = true;
              break;
            case 'sms':
              _.each(subscribers, user => {
                sendSMS({
                  to: user.phone_number,
                  subject: 'From Shoppe',
                  message: v.message,
                });
              });

              v.is_sent = true;
              break;
            case 'facebook_messenger':
              _.each(subscribers, user => {
                sendFBMessage({
                  to: user.facebook_messenger_id,
                  message: v.message,
                });
              });

              v.is_sent = true;
              break;
          }
        }
      );

      await event.save();
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * Per 1-min runner to send event notifications
 */
function perMinSchedule() {
  console.log("Running per 1-min scheduler ...");

  // prevent invoking function more than once per minute
  const _tEventNotificationHandler = _.throttle(eventNotificationHandler, 60 * 1000);
  let locked = false;

  // run the cron task at 1-minute interval
  schedule.scheduleJob('* 1 * * * *', async () => {
    if (locked) {
      return;
    }

    locked = true;
    await _tEventNotificationHandler();
    locked = false;
  });
}

export default perMinSchedule;
