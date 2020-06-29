const { agent, prepare, getLoggedInUser } = require('../lib/data-helper/data-helper');

const Post = require('../lib/models/Post');


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
});
