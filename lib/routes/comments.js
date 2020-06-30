const { Router } = require('express');
const Comment = require('../models/Comment');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Comment
      .create({
        ...req.body,
        commentBy: req.user._id
      })
      .then(comment => res.send(comment))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Comment
      .verifyAndDeleteComment(req.user, req.params.id)
      .then(comment => res.send(comment))
      .catch(next);
  });
