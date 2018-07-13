import _ from 'lodash';

import Subscriber from './subscriber.model';

async function list(req, res) {
  try {
    const subscribers = await Subscriber.find({ workflow_id: req.body.workflow_id });

    return res.success({ subscribers });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function show(req, res) {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    return res.success({ subscriber });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function create(req, res) {
  try {
    const subscriber = await Subscriber.create(new Subscriber(req.body));

    return res.success({ subscriber });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function update(req, res) {
  delete req.body._id;
  delete req.body.workflow_id;

  try {
    const subscriber = await Subscriber.findById(req.params.id);
    const updated = _.merge(subscriber, req.body);
    await updated.save();

    return res.success({ updated });
  } catch (err) {
    return res.error(err.messsage);
  }
}

async function destroy(req, res) {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    await subscriber.remove();

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
