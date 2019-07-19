import RequestUrlParser from '@core/domain/request/RequestUrlParser';
import axios from 'axios';
import jp from 'jsonpath';

import DataFetcher from '@core/domain/common/port/DataFetcherPort';
import { HttpError } from '@core/domain/common/utils/error';
import Request from '@core/domain/request/Request';

class RandomDotOrgDataFetcherAdapter implements DataFetcher {
  constructor(private apiKey: string) {}

  async fetch(request: Request) {
    let response;

    const min = RequestUrlParser.resolveLeftSideBound(request.url);
    const max = RequestUrlParser.resolveRightSideBound(request.url);

    try {
      response = await axios({
        method: 'post',
        url: 'https://api.random.org/json-rpc/2/invoke',
        headers: {
          'Content-Type': 'application/json',
        },
        data: `{"jsonrpc":"2.0","method":"generateIntegers","params":{
          "apiKey":"${this.apiKey}","n":1,"min":${min},"max":${max},"replacement":true,"base":10},"id":0
        }`,
      });
    } catch (e) {
      throw new HttpError(e.response.statusText, e.response.status);
    }

    return jp.value(response.data, 'result.random.data[0]').toString();
  }
}

export default RandomDotOrgDataFetcherAdapter;
