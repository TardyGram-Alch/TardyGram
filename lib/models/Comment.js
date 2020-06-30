const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    immutable: true
  },
  comment: {
    type: String,
    required: true
  }
});

commentSchema.statics.verifyAndDeleteComment = async function(user, id) {
  //find comment
  const comment = await this.findById(id);
  
  if(String(user.id) === String(comment.commentBy)) {
    return await this.findByIdAndDelete(id);
  } else {
    throw new Error('error, not approved');
  }
};

module.exports = mongoose.model('Comment', commentSchema);
