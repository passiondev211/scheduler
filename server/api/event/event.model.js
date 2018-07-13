import mongoose from 'mongoose';
import _ from 'lodash';

mongoose.Promise = global.Promise;

const EventMessageSchema = new mongoose.Schema(
  {
    send_time_offset: Number, // offset in seconds
    type: {
      type: String,
      enum: [ 'email', 'sms', 'facebook_messenger' ],
      default: 'email',
    },
    message: {
      type: String,
      required: [ true, 'Message is required.' ],
    },
    is_sent: {
      type: Boolean,
      default: false,
    },
    _start: Date,
  },
  {
    timestamps: true,
  },
);

const EventSchema = new mongoose.Schema({
  workflow_id: String,
  type: {
    type: String,
    enum: [ 'item', 'popup', 'albums', 'lives' ],
    default: 'popup',
  },
  event_messages: [ EventMessageSchema ],
}, {
  usePushEach: true
});

const EventQueueSchema = new mongoose.Schema({
  workflow_id: String,
  type: {
    type: String,
    enum: [ 'item', 'popup', 'albums', 'lives' ],
    default: 'popup',
  },
  start: {
    type: Date,
    required: [ true, 'Start time is required.' ],
  },
  event_messages: [ EventMessageSchema ],
}, {
  usePushEach: true
});

/**
 * Pre `update`, `save` hooks
 * Update _start of every event messages before saving event item
 */
EventQueueSchema.pre('save', function(next) {
  _.each(this.event_messages, message => {
    message._start = new Date(this.start.getTime() + message.send_time_offset * 1000);
  });

  next();
});

EventQueueSchema.pre('update', function(next) {
  _.each(this.event_messages, message => {
    message._start = new Date(this.start.getTime() + message.send_time_offset * 1000);
  });

  next();
});

module.exports = {
  'EventMessage': mongoose.model('EventMessage', EventMessageSchema),
  'Event': mongoose.model('Event', EventSchema),
  'EventQueue': mongoose.model('EventQueue', EventQueueSchema),
};
