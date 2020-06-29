const { agent, prepare, getLoggedInUser } = require('../lib/data-helper/data-helper');

const Post = require('../lib/models/Post');
const User = require('../lib/models/User');
const app = require('../lib/app');
const request = require('supertest');


describe('Post routes', () => {
  it('creates a post', async() => {

    const user = await getLoggedInUser();

    return agent
      .post('/api/v1/posts')
      .send({
        photoUrl: 'www.test.com',
        caption: 'test caption sentence',
        tags: ['testtag']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id, 
          photoUrl: 'www.test.com',
          caption: 'test caption sentence',
          tags: ['testtag'],
          __v: 0
        });
      });
  });

  it('GET all posts', async() => {
    const posts = prepare(await Post.find());

    return request(app)
      .get('/api/v1/posts')
      .then(res => {
        expect(res.body).toEqual(posts);
      });
  });

  it('GET by id and comments and user', async() => {
    const post = prepare(await Post.findOne());
    const user = prepare(await User.findOne({ _id: post.user }));
    // const comments = prepare(await Comment.find({ post: post._id }));

    return request(app)
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          ...post, 
          user
          // comment: //map over comment 
        });
      });

  });
});
