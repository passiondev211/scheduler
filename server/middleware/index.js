import express from 'express';
import resError from './res_error';
import resSuccess from './res_success';

const router = express.Router();

// middlewares
router.use(resError);
router.use(resSuccess);

export default router;
