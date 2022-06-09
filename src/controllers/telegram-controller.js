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
        case '/btc':
        case '/bitcoin':
        case '/btc@TheHUEHUE_bot': {
          const valueBrl = new Intl
            .NumberFormat('pt-BR', currencyFormat)
            .format(values.results.bitcoin.mercadobitcoin.last);
          const valueUsd = new Intl
            .NumberFormat('pt-BR', currencyFormat)
            .format(values.results.bitcoin.coinbase.last);
          await Telegram.sendMessage(chat.id, `Bitcoin:\nR$ ${valueBrl}\nUS$ ${valueUsd}`);
          break;
        }
        case '/eth':
        case '/ethereum':
        case '/eth@TheHUEHUE_bot': {
          const ethValues = await Currency.getEthBrl();
          const ethBrl = new Intl
            .NumberFormat('pt-BR', currencyFormat)
            .format(ethValues.ticker.last);
          const ethUsd = new Intl
            .NumberFormat('pt-BR', currencyFormat)
            .format(ethValues.ticker.last / values.results.currencies.USD.buy);
          await Telegram.sendMessage(chat.id, `Ethereum:\nR$ ${ethBrl}\nUS$ ${ethUsd}`);
          break;
        }
        case '/cad':
        case '/canadian-dollar':
        case '/cad@TheHUEHUE_bot': {
          const value = new Intl.NumberFormat('pt-BR', currencyFormat).format(values.results.currencies.CAD.buy);
          await Telegram.sendMessage(chat.id, `Dólar canadense:\nR$ ${value}`);
          break;
        }
        case '/eur':
        case '/euro':
        case '/eur@TheHUEHUE_bot': {
          const value = new Intl.NumberFormat('pt-BR', currencyFormat).format(values.results.currencies.EUR.buy);
          await Telegram.sendMessage(chat.id, `Euro:\nR$ ${value}`);
          break;
        }
        case '/usd':
        case '/dollar':
        case '/usd@TheHUEHUE_bot': {
          const value = new Intl.NumberFormat('pt-BR', currencyFormat).format(values.results.currencies.USD.buy);
          await Telegram.sendMessage(chat.id, `Dólar:\nR$ ${value}`);
          break;
        }
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
