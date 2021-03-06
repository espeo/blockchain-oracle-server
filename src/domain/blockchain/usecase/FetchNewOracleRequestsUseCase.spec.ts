import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';

import SilentLogger from '@core/application/logger/SilentLoggerAdapter';

import { OracleGateway } from '../port';
import FetchNewOracleRequestsUseCase from './FetchNewOracleRequestsUseCase';

describe('FetchNewOracleRequestUseCase', () => {
  const oracle = () => ({
    getRequests: (fromBlock, toBlock) => Promise.resolve([{ id: 'abc', url: 'abc', validFrom: Date.now() } as any]),
    sendResponse: () => Promise.resolve(),
  } as OracleGateway);

  let sut: any;

  beforeEach(() => {
    // given
    sut = new FetchNewOracleRequestsUseCase(oracle() as OracleGateway, new SilentLogger(), 1);
  });

  it('should fetch new oracle responses', async () => {
    // when
    const requests: Request[] = await sut.fetchNewRequests(4);
    // then
    expect(requests).to.be.an.instanceof(Array);
    expect(requests).to.have.lengthOf(1);
    expect(sut.lastBlock as number).to.equal(4);
  });

  it('should return empty array if new block is equal to current one', async () => {
    // when
    const requests: Request[] = await sut.fetchNewRequests(0);
    // then
    expect(requests).to.be.an.instanceof(Array);
    expect(requests).to.have.lengthOf(0);
  });
});
