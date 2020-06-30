const { agent, prepare, getLoggedInUser } = require('../lib/data-helper/data-helper');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');
const app = require('../lib/app');
const request = require('supertest');

describe('comment routes', () => {
  it('will post a comment', async() => {
    const user = await getLoggedInUser();
    const randomPost = prepare(await Post.findOne());

    return agent
      .post('/api/v1/comments')
      .send({
        post: randomPost._id,
        comment: 'yay labs... ;(',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          __v: 0,
          post: randomPost._id,
          comment: 'yay labs... ;(',
          commentBy: user.id
        });
      });
  });

  it('will delete a comment if it is the user who commented it', async() => {
    const user = await getLoggedInUser();
    const randomPost = prepare(await Post.findOne());
    const comment = prepare(await Comment.create({
      commentBy: user._id,
      post: randomPost._id,
      comment: 'delete'
    }));
    return agent
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => expect(res.body).toEqual(comment));
  });
  it('will not delete a comment if it is not the user who commented it', async() => {
    const user = await getLoggedInUser();
    const randomPost = prepare(await Post.findOne());
    const comment = prepare(await Comment.create({
      commentBy: user._id,
      post: randomPost._id,
      comment: 'delete'
    }));
    const loginTester = request.agent(app);
    await loginTester
      .post('/api/v1/auth/login')
      .send({
        username: 'test1@test.com',
        password: 'password'
      });
    return loginTester
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => expect(res.body).toEqual({
        message: 'error, not approved',
        status: 500
      }));
  });
});
