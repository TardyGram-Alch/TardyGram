const mongoose = require('mongoose');
const popular = require('./post-aggregations');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true
  },
  photoUrl: {
    type: String,
    required: true,
    immutable: true
  },
  caption: {
    type: String, 
    required: true
  },
  tags: {
    type: [String],
    immutable: true 
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

schema.statics.verifyAndUpdate = async function(user, body, id) {
  //find post 
  const post = await this.findById(id);

  if(String(user.id) === String(post.user)) {

    return await this.findByIdAndUpdate(id, body, { new: true });
  } else {
    throw new Error('error');
  }
};

schema.statics.verifyAndDelete = async function(user, id) {
  //find post 
  const post = await this.findById(id);
  
  if(String(user.id) === String(post.user)) {
    return await this.findByIdAndDelete(id);
  } else {
    throw new Error('error');
  }
};

schema.statics.popular = function() {
  return this.aggregate(popular);
};


module.exports = mongoose.model('Post', schema);
