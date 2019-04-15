import Intl from 'intl';

import logger from '../services/logger';
import Currency from '../services/currency';
import Telegram from '../services/telegram';

export default class TelegramController {
  static async handleMessages(req, res) {
    try {
      // data received from telegram webhooker
      const { chat, text, entities } = req.body.message;

      // check if it's a bot command
      if (!Telegram.isBotCommand(entities)) return res.json({ success: true });

      // handle bot command
      const values = await Currency.getValues();
      const currencyFormat = { style: 'currency', currency: 'BRL' };

      if (text === '/dolar' || text === '/dolar@TheHUEHUE_bot') {
        const value = new Intl.NumberFormat('pt-BR', currencyFormat).format(values.results.currencies.USD.buy);
        await Telegram.sendMessage(chat.id, `Dólar: ${value}`);
      } else if (text === '/bitcoin' || text === '/btc' || text === '/bitcoin@TheHUEHUE_bot') {
        const value = new Intl.NumberFormat('pt-BR', currencyFormat).format(values.results.bitcoin.mercadobitcoin.last);
        await Telegram.sendMessage(chat.id, `Bitcoin: ${value}`);
      }

      return res.json({ success: true });
    } catch (err) {
      logger.error(logger.levels.error, 'There was an error with Telegram endpoint.', err);

      return res.status(500).json({
        success: false,
        message: 'There was an error with Telegram endpoint.',
      });
    }
  }
}
