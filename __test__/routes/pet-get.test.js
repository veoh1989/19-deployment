'use strict';

const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('GET /api/v1/pet', function() {
  beforeAll(server.start);
  beforeAll(() => mocks.auth.createOne().then(data => this.mockUser = data));
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.pet.removeAll);

  describe('Valid request', () => {
    it('should return a 200 status code for find all', () => {
      let petMock = null;
      return mocks.pet.createOne()
        .then(mock => {
          petMock = mock;
          return superagent.get(`:${process.env.PORT}/api/v1/pet`)
            .set('Authorization', `Bearer ${petMock.token}`);
        })
        .then(res => this.response = res)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
    it('should return a 200 status code for find one', () => {
      let petMock = null;
      return mocks.pet.createOne()
        .then(mock => {
          petMock = mock;
          return superagent.get(`:${process.env.PORT}/api/v1/pet/${petMock._id}`)
            .set('Authorization', `Bearer ${petMock.token}`);
        })
        .then(res => this.response = res)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
  });

  describe('Invalid request', () => {
    it('should return a 401 given bad token', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/pet`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 404 no found', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/pet123`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});