import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const SubscriberSchema = new mongoose.Schema(
  {
    workflow_id: String,
    entranceSlug: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: email => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email),
        message: 'Email is not valid.',
      },
      required: [true, 'Email is required.'],
    },
    phone_number: {
      type: String,
      validate: {
        validator: phone => (!phone || /\d{3}-\d{3}-\d{4}/.test(phone)),
        message: 'Phone number is not valid.',
      },
    },
    facebook_messenger_id: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Subscriber', SubscriberSchema);
