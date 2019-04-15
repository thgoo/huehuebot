import Axios from 'axios';

export default class Telegram {
  static async sendMessage(chatId, text) {
    const { TELEGRAM_TOKEN } = process.env;
    const ENDPOINT = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    return Axios.post(ENDPOINT, {
      chat_id: chatId,
      text,
    });
  }

  static isBotCommand(entities) {
    let isBotCommand = false;

    if (entities) {
      for (let i = 0; i < entities.length; i += 1) {
        if (entities[i].type === 'bot_command') {
          isBotCommand = true;
          break;
        }
      }
    }

    return isBotCommand;
  }
}
