'use strict';

const Auth = require('../../model/auth');//  similar to a user
const faker = require('faker');
const Pet = require('../../model/pet');

// {auth:{},pet:{},mario:{}}
const mocks = module.exports = {};
mocks.auth = {};

mocks.auth.createOne = () => {
  let result = {};
  result.password = faker.internet.password();

  return new Auth({
    username: faker.internet.userName(),
    email: faker.internet.email(),
  })
    .generatePasswordHash(result.password)
    .then(user => result.user = user)
    .then(user => user.generateToken())
    .then(token => result.token = token)
    .then(() => {
      return result;
    });
};

mocks.pet = {};
mocks.pet.createOne = () => {
  let resultMock = null;

  return mocks.auth.createOne()
    .then(createdUserMock => resultMock = createdUserMock)
    .then(createdUserMock => {
      return new Pet({
        name: faker.internet.domainWord(),
        breed: faker.random.words(15),
        userId: createdUserMock.user._id,
      }).save(); // something is being saved into Mongo
    })
    .then(pet => {
      resultMock.pet = pet;
      //console.log(resultMock);
      return resultMock;
    });
};
mocks.auth.removeAll = () => Promise.all([Auth.remove()]);