const { Router } = require('express');
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post
      .create({ ...req.body, user: req.user._id })
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Post
      .find(req.query)
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/popular', (req, res, next) => {
    Post
      .popular()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Post
      .findById(req.params.id)
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'commentBy',
          select: {
            username: true
          }
        }
      })
      .then(post => res.send(post))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Post
      .verifyAndUpdate(req.user, req.body, req.params.id)
      .then(post => res.send(post))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Post
      .verifyAndDelete(req.user, req.params.id)
      .then(post => res.send(post))
      .catch(next);
  });
