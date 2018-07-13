import _ from 'lodash';

import { Event, EventMessage } from './event.model';

async function list(req, res) {
  try {
    const events = await Event.find({ workflow_id: req.body.workflow_id });

    return res.success({ events });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function show(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    return res.success({ event });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function create(req, res) {
  try {
    const event = await Event.create(new Event(req.body));

    return res.success({ event });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function update(req, res) {
  delete req.body._id;
  delete req.body.workflow_id;
  delete req.body.event_messages;

  try {
    const event = await Event.findById(req.params.id);
    const updated = _.merge(event, req.body);
    await updated.save();

    return res.success({ updated });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function createEventMessage(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    event.event_messages.push(req.body);
    await event.save();

    return res.success({ updated: event });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function updateEventMessages(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    event.event_messages = req.body.event_messages;
    await event.save();

    return res.success({ updated: event });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function destroy(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    await event.remove();

    return res.success();
  } catch (err) {
    return res.error(err.messsage);
  }
}

export default {
  list,
  show,
  create,
  update,
  destroy,
  updateEventMessages,
  createEventMessage,
};
