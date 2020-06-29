require('dotenv').config;

const chance = require('chance').Chance();

const User = require('../models/User');

module.exports = async({ users = 5 } = {}) => {
  const createdUsers = await User.create([...Array(users)].map((_, i) => ({
    username: `test${i}@test.com`,
    password: 'password',
    profilePhotoUrl: chance.url()
  })));
};
