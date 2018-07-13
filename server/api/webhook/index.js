/**
 * { event_type: 'popup.created', user_id: 123, starts: '2018-03-08T10:45:39.115Z', ends: '2018-03-08T10:45:39.115Z', ... }
 * filter events by event_type, and queue them into `EventQueue` Table
 */

import express from 'express';
import _ from 'lodash';

import Workflow from '../workflow/workflow.model';
import { Event, EventQueue } from '../event/event.model';

const router = express.Router();

const _trimEventData = function(event) {
  return {
    workflow_id: event.workflow_id,
    event_messages: _.map(event.event_messages, em => {
      return {
        send_time_offset: em.send_time_offset,
        message: em.message,
        is_sent: em.is_sent,
        type: em.type,
      };
    }),
  };
}

/**
 * Filter the list of events that match criteria, and put them in a event queue
 */
const _createEvents = async (workflow_id, event_type, start) => {
  try {
    const events = await Event.find({
      workflow_id: workflow_id,
      type: event_type
    });

    await _.each(events, async event => {
      const elem = new EventQueue(_.merge(
        _trimEventData(event),
        {
          start: start
        }
      ));

      await EventQueue.create(elem);
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Update the events on a event queue
 */
const _updateEvents = async (workflow_id, event_type, start) => {
  try {
    const eventsOnQueue = await EventQueue.find({
      workflow_id: workflow_id,
      type: event_type
    });

    await _.each(eventsOnQueue, async event => {
      event.start = start;
      await event.save();
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Remove the events on a event queue, which match certain criteria
 */
const _deleteEvents = async (workflow_id, event_type) => {
  try {
    const eventsOnQueue = await EventQueue.find({
      workflow_id: workflow_id,
      type: event_type
    });

    await _.each(eventsOnQueue, async event => {
      await event.remove();
    });
  } catch (err) {
    console.log(err);
  }
};

/*
 * req.body -
 * {
 *    "event_type": "popup.created",
 *    "user_id": 1,
 *    "starts": "2018-03-23T10:45:39.115Z",
 *    "ends": "2018-03-24T10:45:39.115Z"
 * }
 */
router.post('/', async (req, res) => {
  if (typeof req.body.event_type === 'undefined') {
    return res.error('Invalid request');
  }

  try {
    const workflows = await Workflow.find({
      user_id: req.body.user_id
    });

    // event_type_action[0] -> popup, event_type_action[1] -> created
    const event_type_action = req.body.event_type.split('.');
    switch (event_type_action[1]) {
      case 'created':
        await _.each(workflows, async workflow => {
          await _createEvents(workflow._id, event_type_action[0], req.body.starts);
        });

        break;
      case 'updated':
        await _.each(workflows, async workflow => {
          await _updateEvents(workflow._id, event_type_action[0], req.body.starts);
        });

        break;
      case 'deleted':
        await _.each(workflows, async workflow => {
          await _deleteEvents(workflow._id, event_type_action[0]);
        });

        break;
    }

    return res.success();
  } catch (err) {
    return res.error(err.messsage);
  }
});

module.exports = router;
