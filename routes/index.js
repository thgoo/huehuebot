import express from 'express';

import api from './api';
import web from './web';

const router = express.Router();
router.use(api);
router.use(web);

export default router;
