import express from 'express';

import TelegramController from '../src/controllers/telegram-controller';

const router = express.Router();

router.post(`/api/handle-messages/${process.env.TELEGRAM_TOKEN}`, TelegramController.handleMessages);

export default router;
