import Axios from 'axios';

export default class Currency {
  static async getValues() {
    const { HGBRASIL_KEY } = process.env;
    const { data } = await Axios.get(`https://api.hgbrasil.com/finance?format=json&key=${HGBRASIL_KEY}`);

    return data;
  }

  static async getEthBrl() {
    const { data } = await Axios.get('https://www.mercadobitcoin.net/api/ETH/ticker');

    return data;
  }
}
