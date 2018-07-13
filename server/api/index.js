import express from 'express';

import auth from '../auth/auth.service';

const router = express.Router();

// anonymous
router.use('/webhook', require('./webhook'));

// seller area
router.use('/workflows', auth.isSeller(), require('./workflow'));

// workflow sub endpoints
router.use('/workflows/:workflow_id', (req, res, next) => {
  req.body.workflow_id = req.params.workflow_id;
  next();
});
router.use('/workflows/:workflow_id/events', auth.isSeller(), require('./event'));
router.use('/workflows/:workflow_id/subscribers', auth.isSeller(), require('./subscriber'));

export default router;
