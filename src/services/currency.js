import Axios from 'axios';

export default class Currency {
  static async getValues() {
    const res = await Axios.get('https://api.hgbrasil.com/finance?format=json&key=e7ae921d');

    return res.data;
  }
}
