require('dotenv').config;

const chance = require('chance').Chance();

const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

module.exports = async({ users = 21, posts = 200, comments = 2000 } = {}) => {
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

  await Comment.create([...Array(comments)].map(() => ({
    commentBy: chance.pickone(createdUsers)._id,
    post: chance.pickone(createdPosts)._id,
    comment: chance.sentence()
  })));
};
