import _ from 'lodash';

import Workflow from './workflow.model';
import { Event } from '../event/event.model';

async function list(req, res) {
  try {
    const workflows = await Workflow.find();

    return res.success({ workflows });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function show(req, res) {
  try {
    const workflow = await Workflow.findById(req.params.id);

    return res.success({ workflow });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function create(req, res) {
  try {
    const eventType = req.body.eventType;
    delete req.body.eventType;

    const tmp = new Workflow(req.body);
    tmp.user_id = req.user.profile.id;

    const workflow = await Workflow.create(tmp);
    await Event.create(new Event({
      workflow_id: workflow._id,
      type: eventType,
    }));

    return res.success({ workflow });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  try {
    const workflow = await Workflow.findOne({
      user_id: req.user.profile.id,
      _id: req.params.id,
    });
    const updated = _.merge(workflow, req.body);
    await updated.save();

    return res.success({ updated });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function destroy(req, res) {
  try {
    const workflow = await Workflow.findOne({
      user_id: req.user.profile.id,
      _id: req.params.id,
    });
    await workflow.remove();

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
};
