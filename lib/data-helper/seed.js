require('dotenv').config;

const chance = require('chance').Chance();

const User = require('../models/User');
const Post = require('../models/Post');

module.exports = async({ users = 5, posts = 29 } = {}) => {
  const createdUsers = await User.create([...Array(users)].map((_, i) => ({
    username: `test${i}@test.com`,
    password: 'password',
    profilePhotoUrl: chance.url()
  })));

  const createdPosts = await Post.create([...Array(posts)].map(() => ({
    user: chance.pickone(createdUsers)._id,
    photoUrl: chance.url(),
    caption: chance.paragraph({ sentence: 2 }),
    tags: chance.pickone([chance.hashtag(), chance.hashtag(), chance.hashtag()])
  })));
};
