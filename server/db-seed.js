import mongoose from 'mongoose';

import config from './config/environment';
import Workflow from './api/workflow/workflow.model';
import { Event } from './api/event/event.model';

const TEST_USER_ID = 1;

var conn = mongoose.connect(config.mongo.uri, config.mongo.options, async err => {
  try {
    await conn.db.dropDatabase();

    /**
     * create workflows
     */
    const workflow1 = await Workflow.create(
      {
        user_id: TEST_USER_ID,
        title: 'Account creation',
        active: true,
      }
    );

    const workflow2 = await Workflow.create(
      {
        user_id: TEST_USER_ID,
        title: 'Sell a product',
        active: true,
      }
    );

    /**
     * create events
     */
    await Event.create(
      {
        workflow_id: workflow1._id,
        type: 'albums',
        event_messages: [
          {
            send_time_offset: -5,
            type: 'email',
            message: 'This is a reminder notification for Event 1',
          },
          {
            send_time_offset: 1,
            type: 'email',
            message: 'This is a start-up alert for Event 1',
          },
          {
            send_time_offset: 5,
            type: 'sms',
            message: 'This is an end notification for Event 1',
          },
        ]
      },
      {
        workflow_id: workflow1._id,
        event_messages: [
          {
            send_time_offset: -5,
            type: 'sms',
            message: 'This is a reminder notification for Event 2',
          },
          {
            send_time_offset: 1,
            type: 'email',
            message: 'This is a start-up alert for Event 2',
          },
          {
            send_time_offset: 1,
            type: 'email',
            message: 'This is a after-alert for Event 2',
          },
        ]
      }
    );

    await Event.create(
      {
        workflow_id: workflow2._id,
        event_messages: [
          {
            send_time_offset: -5,
            type: 'email',
            message: 'This is reminder notification for Event 3',
          },
          {
            send_time_offset: 5,
            type: 'email',
            message: 'This is a start-up alert for Event 3',
          },
        ]
      },
      {
        workflow_id: workflow2._id,
        type: 'lives',
        event_messages: [
          {
            send_time_offset: -5,
            type: 'email',
            message: 'This is reminder notification for Event 4',
          },
          {
            send_time_offset: 10,
            type: 'facebook_messenger',
            message: 'This is a start-up alert for Event 4',
          },
        ]
      }
    );

    console.log("Test data created successfully ...");
  } catch (e) {
    console.log(e);
  }

  process.exit();
});
