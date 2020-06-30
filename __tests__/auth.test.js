const { agent, prepare } = require('../lib/data-helper/data-helper');

const User = require('../lib/models/User');

describe('Auth Routes', () => {
    
  it('signs up a user', () => {
    return agent
      .post('/api/v1/auth/signup')
      .send({
        username: 'bobby hill',
        password: 'hank hill',
        profilePhotoUrl: 'abcdefghijkl'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          __v: 0,
          username: 'bobby hill',
          profilePhotoUrl: 'abcdefghijkl'
        });
      });
  });

  it('log ins a user', async() => {
    const newUser = prepare(await User.findOne());
    return agent
      .post('/api/v1/auth/login')
      .send({
        username: newUser.username,
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual(newUser);
      });
  });

  it('verifys a user is logged in', () => {
    return agent
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          username: 'test0@test.com',
          __v: 0,
          _id: expect.anything(),
          profilePhotoUrl: expect.any(String),
        });
      });
  });
});
