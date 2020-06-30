const { agent, prepare, getLoggedInUser } = require('../lib/data-helper/data-helper');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');
const app = require('../lib/app');
const request = require('supertest');

describe('comment routes', () => {
  it('respond with the 10 users with the most total comments on their posts', () => {
    return request(app)
      .get('/api/v1/users/popular')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body).toEqual(res.body.map(() => ({
          _id: expect.anything(),
          username: expect.any(String),
          profilePhotoUrl: expect.any(String),
          totalComments: expect.any(Number)
        })));
      });
  });

  it('respond with the 10 users with the most posts', () => {
    return request(app)
      .get('/api/v1/users/prolific')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body).toEqual(res.body.map(() => ({
          _id: expect.anything(),
          username: expect.any(String),
          profilePhotoUrl: expect.any(String),
          totalPosts: expect.any(Number)
        })));
      });
  });

  it('respond with the 10 users with the most comments', () => {
    return request(app)
      .get('/api/v1/users/leader')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body).toEqual(res.body.map(() => ({
          _id: expect.anything(),
          username: expect.any(String),
          profilePhotoUrl: expect.any(String),
          totalComments: expect.any(Number)
        })));
      });
  });

  it('respond with the 10 users with the highest $avg comments per post', () => {
    return request(app)
      .get('/api/v1/users/impact')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body).toEqual(res.body.map(() => ({
          _id: expect.anything(),
          username: expect.any(String),
          profilePhotoUrl: expect.any(String),
          avgCommentsPerPost: expect.any(Number)
        })));
      });
  });
});
