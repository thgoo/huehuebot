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

      const values = await Currency.getValues();
      const currencyFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

      // handle bot command
      switch (text) {
        case '/bitcoin':
        case '/btc':
        case '/bitcoin@TheHUEHUE_bot':
          const valueBrl = new Intl
            .NumberFormat('pt-BR', currencyFormat)
            .format(values.results.bitcoin.mercadobitcoin.last);
          const valueUsd = new Intl
            .NumberFormat('pt-BR', currencyFormat)
            .format(values.results.bitcoin.coinbase.last);
          await Telegram.sendMessage(chat.id, `Bitcoin:\nR$ ${valueBrl}\nUS$ ${valueUsd}`);
          break;
        case '/ethereum':
        case '/eth':
        case '/ethereum@TheHUEHUE_bot':
          const ethValues = await Currency.getEthBrl();
          const ethBrl = new Intl
            .NumberFormat('pt-BR', currencyFormat)
            .format(ethValues.ticker.last);
          const ethUsd = new Intl
            .NumberFormat('pt-BR', currencyFormat)
            .format(ethValues.ticker.last / values.results.currencies.USD.buy);
          await Telegram.sendMessage(chat.id, `Ethereum:\nR$ ${ethBrl}\nUS$ ${ethUsd}`);
          break;
        case '/dolar':
        case '/dolar@TheHUEHUE_bot':
          const value = new Intl.NumberFormat('pt-BR', currencyFormat).format(values.results.currencies.USD.buy);
          await Telegram.sendMessage(chat.id, `Dólar:\nR$ ${value}`);
          break;
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
