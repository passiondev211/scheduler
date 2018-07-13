import express from 'express';

import Subscriber from './subscriber/subscriber.model';
import Workflow from './workflow/workflow.model';

const router = express.Router();

/**
 * Display registration form for workflow
 */
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  if (typeof slug === 'undefined') {
    return res.error('Invalid request');
  }

  try {
    const workflow = await Workflow.findOne({ entranceSlug: slug });
    if (!workflow) {
      return res.error("Not found", 401);
    }

    // pre-load data for registration form
    let regForm = workflow.regForm;
    regForm = regForm.replace('{ENTRANCE_SLUG}', workflow.entranceSlug);

    return res.send(regForm);
  } catch (err) {
    return res.error(err.messsage);
  }
});

/**
 * Registration form submission handler
 */
router.post('/', async (req, res) => {
  const entranceSlug = req.body.entranceSlug;
  if (typeof entranceSlug === 'undefined') {
    return res.error('Invalid request');
  }

  try {
    const workflow = await Workflow.findOne({ entranceSlug: entranceSlug });
    if (!workflow) {
      return res.error("Not found", 401);
    }

    const body = {
      workflow_id: workflow._id,
      entranceSlug: entranceSlug,
      email: req.body.email,
      phone_number: req.body.phone_number,
      facebook_messenger_id: req.body.facebook_messenger_id
    };
    const subscriber = await Subscriber.create(new Subscriber(body));

    return res.redirect(`/subscribe/${entranceSlug}?success`);
  } catch (err) {
    console.log(err);
    return res.redirect(`/subscribe/${entranceSlug}?fail`);
  }
});

module.exports = router;
