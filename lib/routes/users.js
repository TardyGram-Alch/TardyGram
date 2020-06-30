const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/popular', (req, res, next) => {
    User
      .popular()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/prolific', (req, res, next) => {
    User
      .prolific()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/leader', (req, res, next) => {
    User
      .leader()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/impact', (req, res, next) => {
    User
      .impact()
      .then(posts => res.send(posts))
      .catch(next);
  });

