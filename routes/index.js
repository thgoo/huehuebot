import express from 'express';
import api from './api';

const router = express.Router();
router.use(api);

router.get('/', (req, res) => {
  res.send({ brbr: 'huehue' });
});

export default router;
