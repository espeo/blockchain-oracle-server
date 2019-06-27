const axios = require('axios');
const jp = require('jsonpath');
const { HttpError } = require('../domain/common/utils/error');


class RandomDotOrgDataFetcherAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetch(min, max) {
    let response;

    try {
      response = await axios({
        method: 'post',
        url: 'https://api.random.org/json-rpc/2/invoke',
        headers: {
          'Content-Type': 'application/json',
        },
        data: `{"jsonrpc":"2.0","method":"generateIntegers","params":{"apiKey":"${this.apiKey}","n":1,"min":${min},"max":${max},"replacement":true,"base":10},"id":0}`,
      });
    } catch (e) {
      throw new HttpError(e.response.statusText, e.response.status);
    }

    return jp.value(response.data, 'result.random.data[0]').toString();
  }
}

module.exports = RandomDotOrgDataFetcherAdapter;