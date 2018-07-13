import mongoose from 'mongoose';
import randToken from 'rand-token';

import { Event, EventQueue } from '../event/event.model';
import Subscriber from '../subscriber/subscriber.model';
import regFormTemplate from './reg_form_template.js';

mongoose.Promise = global.Promise;

const WorkflowSchema = new mongoose.Schema(
  {
    user_id: String,
    title: {
      type: String,
      required: [ true, 'Title is required.' ],
    },
    active: {
      type: Boolean,
      default: false,
    },
    regForm: {
      type: String,
      default: regFormTemplate,
    },
    entranceSlug: {
      type: String,
      default: function() {
        return randToken.generate(64);
      }
    },
  },
  {
    timestamps: true,
  },
);

WorkflowSchema.post('remove', function(workflow) {
  EventQueue.remove({ workflow_id: workflow._id }).exec();
  Event.remove({ workflow_id: workflow._id }).exec();
  Subscriber.remove({ workflow_id: workflow._id }).exec();
});

export default mongoose.model('Workflow', WorkflowSchema);
