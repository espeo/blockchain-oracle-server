import { expect } from 'chai';
import { describe, it } from 'mocha';
import {ConsoleLoggerAdapter} from '../../adapter';
import InMemoryRequestRepository from './inmemory/InMemoryRequestRepositoryAdapter';
import MongoDBRequestRepository from './mongodb/MongoDbRequestRepositoryAdapter';
import RequestRepositoryFactory from './RequestRepositoryFactory';

describe('RequestRepositoryFactory', () => {
  it('should create InMemoryRequestRepository when type is INMEMORY', () => {
    // when
    const requestRepository = RequestRepositoryFactory.create('INMEMORY', new ConsoleLoggerAdapter());
    // then
    expect(requestRepository).to.be.an.instanceOf(InMemoryRequestRepository);
  });

  it('should create MongoDBRequestRepository when type if MONGODB', () => {
    // when
    const requestRepository = RequestRepositoryFactory.create('MONGODB', new ConsoleLoggerAdapter());
    // then
    expect(requestRepository).to.be.an.instanceOf(MongoDBRequestRepository);
  });

  it('should fail if type is neither INMEMORY nor MONGODB', () => {
    // when/then
    expect(() => RequestRepositoryFactory.create('INVALID', new ConsoleLoggerAdapter())).to.throw();
  });
});
