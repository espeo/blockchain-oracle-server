import { omit } from 'lodash';

import RequestRepositoryPort from '../../../domain/request/port/RequestRepositoryPort';
import { RequestStateEnum } from '../../../domain/request/RequestStateEnum';
import RequestModel from './RequestModel';
import Request from '../../../domain/request/Request';

class MongoDbRequestRepositoryAdapter extends RequestRepositoryPort {
  constructor(private logger) {
    super();
  }

  async exists(id) {
    const count = await RequestModel.count({ _id: id });

    return count > 0;
  }

  save(request) {
    const mongoRequest = RequestModel({
      _id: request.id,
      url: request.url,
      validFrom: request.validFrom,
      state: request.state.name,
    });

    const upsertDocument = omit(mongoRequest.toObject(), ['_id']);

    return RequestModel.findOneAndUpdate(
      { _id: mongoRequest._id },
      upsertDocument,
      { upsert: true, new: true },
    ).then(result => this.logger.info(`Request saved into database [request=${JSON.stringify(result)}]`));
  }

  async getScheduledRequestsWithValidFromBeforeNow() {
    const results = await RequestModel.find({
      state: RequestStateEnum.SCHEDULED,
      validFrom: { $lt: Date.now() },
    }).exec();

    return this._mapMongoResultsToDomainRequests(results);
  }

  async getReadyRequests() {
    const results = await RequestModel.find({
      state: RequestStateEnum.READY,
    }).exec();

    return this._mapMongoResultsToDomainRequests(results);
  }

  _mapMongoResultsToDomainRequests(results) {
    return results
      .map(result => new Request(result._id, result.url, result.validFrom, result.state));
  }
}

export default MongoDbRequestRepositoryAdapter;