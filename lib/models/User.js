const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { popular, prolific, leader, impact } = require('./user-aggregations');

const users = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
  },
  profilePhotoUrl: {
    type: String
  } }, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id,
      delete ret.passwordHash;
    }
  }
});

users.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user'
});

users.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'commentBy'
});

users.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.nextTick.SALT_ROUNDS || 8);
});

users.statics.authorize = function(username, password) {
  return this.findOne({ username })
    .then(user => {
      if(!user) {
        throw new Error('Invalid Login Information');
      }
      if(!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid Login Information');
      }
        
      return user;
    });
};

users.statics.verifyToken = function(token) {
  const { sub } = jwt.verify(token, process.env.APP_SECRET);
  return this.hydrate(sub);
};

users.methods.authToken = function() {
  return jwt.sign({ sub: this.toJSON() }, process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};

users.statics.popular = function() {
  return this.aggregate(popular);
};

users.statics.prolific = function() {
  return this.aggregate(prolific);
};

users.statics.leader = function() {
  return this.aggregate(leader);
};

users.statics.impact = function() {
  return this.aggregate(impact);
};

module.exports = mongoose.model('User', users);
