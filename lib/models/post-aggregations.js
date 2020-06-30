module.exports = [
  {
    '$lookup': {
      'from': 'comments', 
      'localField': '_id', 
      'foreignField': 'post', 
      'as': 'comments'
    }
  }, {
    '$project': {
      '_id': 1, 
      'user': 1, 
      'photoUrl': 1, 
      'caption': 1, 
      'allComments': {
        '$size': '$comments'
      }
    }
  }, {
    '$sort': {
      'allComments': -1
    }
  }, {
    '$limit': 10
  }
];
