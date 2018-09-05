import axios from 'axios';
import express from 'express';
import Intl from 'intl';
import logger from '../../logger';

const router = express.Router();

const sendMessage = async (chatId, text) => {
  const ENDPOINT = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;

  return axios.post(ENDPOINT, {
    chat_id: chatId,
    text,
  });
};

const getValues = async () => axios.get('https://api.hgbrasil.com/finance?format=json&key=e7ae921d');

router.post(`/api/handle-messages/${process.env.TELEGRAM_TOKEN}`, async (req, res) => {
  try {
    let { chat, text, entities } = req.body.message;
    let isBotCommand = false;

    if (entities) {
      for (let i = 0; i < entities.length; i += 1) {
        if (entities[i].type === 'bot_command') {
          isBotCommand = true;
          break;
        }
      }
    }

    if (!isBotCommand) return res.json({ success: true });

    let values = (await getValues()).data;

    if (text === '/dolar' || text === '/dolar@TheHUEHUE_bot') {
      let value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(values.results.currencies.USD.buy);
      await sendMessage(chat.id, `Dólar: ${value}`);
    } else if (text === '/bitcoin' || text === '/btc' || text === '/bitcoin@TheHUEHUE_bot') {
      let value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(values.results.bitcoin.mercadobitcoin.last);
      await sendMessage(chat.id, `Bitcoin: ${value}`);
    }
  } catch (err) {
    logger.error(logger.levels.error, 'There was an error with Telegram endpoint.', err);
    return res.status(500).json({
      success: false,
      message: 'There was an error with Telegram endpoint.',
    });
  }

  return res.json({ success: true });
});

export default router;
