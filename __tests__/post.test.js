const { agent, prepare, getLoggedInUser } = require('../lib/data-helper/data-helper');

const Post = require('../lib/models/Post');
const User = require('../lib/models/User');
const Comment = require('../lib/models/Comment');
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
    const comments = prepare(await Comment.find({ post: post._id }).populate({ path: 'commentBy', select: { username: true } }));

    return request(app)
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          ...post, 
          user,
          comments: [...comments]
        });
      });

  });

  it('updates a post via PATCH', async() => {
      
    const createdPost = await agent
      .post('/api/v1/posts')
      .send({
        photoUrl: 'www.test.com',
        caption: 'test caption sentence',
        tags: ['testtag']
      })
      .then(res => res.body);

    return agent
      .patch(`/api/v1/posts/${createdPost._id}`)
      .send({ caption: 'changed caption' })
      .then(res => {
        expect(res.body).toEqual({
          ...createdPost,
          caption: 'changed caption'
        });
      });
  });

  it('does not update a post from a verified user', async() => {
    const createdPost = await agent
      .post('/api/v1/posts')
      .send({
        photoUrl: 'www.test.com',
        caption: 'test caption sentence',
        tags: ['testtag']
      })
      .then(res => res.body);
      
    const loginTester = request.agent(app);

    await loginTester
      .post('/api/v1/auth/login')
      .send({
        username: 'test1@test.com',
        password: 'password'
      });

    return loginTester
      .patch(`/api/v1/posts/${createdPost._id}`)
      .send({ caption: 'changed caption' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'error',
          status: 500
        });
      });
  });

  it('DELETE a post by id by its verified user', async() => {
    const createdPost = await agent
      .post('/api/v1/posts')
      .send({
        photoUrl: 'www.test.com',
        caption: 'test caption sentence',
        tags: ['testtag']
      })
      .then(res => res.body);

    return agent
      .delete(`/api/v1/posts/${createdPost._id}`)
      .then(res => {
        expect(res.body).toEqual({
          ...createdPost
        });
      });
  });

  it('responds with a list of the 10 posts with the most comments', () => {
    return request(app)
      .get('/api/v1/posts/popular')
      .then(res => {
        expect(res.body).toEqual(res.body.map(() => ({
          _id: expect.anything(),
          allComments: expect.any(Number),
          caption: expect.any(String),
          photoUrl: expect.any(String),
          user: expect.any(String)
        })));
        expect(res.body).toHaveLength(10);
      });
  });
});
