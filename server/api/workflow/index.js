import express from 'express';

import controller from './workflow.controller';

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.show);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);

router.delete('/:id', controller.destroy);

module.exports = router;
