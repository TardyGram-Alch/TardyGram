require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../utils/connect');
const app = require('../app');
const request = require('supertest');
const seed = require('./seed');

//logan's approach
const User = require('../models/User');

const agent = request.agent(app);

beforeAll(async() => {
  const uri = await mongod.getUri();
  return connect(uri);
});
  
beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed();
});

beforeEach(() => {
  return agent 
    .post('/api/v1/auth/login')
    .send({
      username: 'test0@test.com',
      password: 'password'
    });
});
  
afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});

const prepareOne = model => JSON.parse(JSON.stringify(model));
const prepareMany = models => models.map(prepareOne);

const prepare = model => {
  if(Array.isArray(model)) return prepareMany(model);
  return prepareOne(model);
};

//logan's approach
const getLoggedInUser = () => User.findOne({
  username: 'test0@test.com'
});

module.exports = {
  agent,
  prepare,
  getLoggedInUser
};
