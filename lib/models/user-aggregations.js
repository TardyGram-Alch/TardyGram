const popular = [
  {
    '$lookup': {
      'from': 'posts', 
      'localField': '_id', 
      'foreignField': 'user', 
      'as': 'posts'
    }
  }, {
    '$lookup': {
      'from': 'comments', 
      'localField': 'posts._id', 
      'foreignField': 'post', 
      'as': 'comments'
    }
  }, {
    '$project': {
      '_id': 1, 
      'username': 1, 
      'profilePhotoUrl': 1, 
      'totalComments': {
        '$size': '$comments'
      }
    }
  }, {
    '$sort': {
      'totalComments': -1
    }
  }, {
    '$limit': 10
  }
];

const prolific = [
  {
    '$lookup': {
      'from': 'posts', 
      'localField': '_id', 
      'foreignField': 'user', 
      'as': 'posts'
    }
  }, {
    '$project': {
      '_id': 1, 
      'username': 1, 
      'profilePhotoUrl': 1, 
      'totalPosts': {
        '$size': '$posts'
      }
    }
  }, {
    '$sort': {
      'totalPosts': -1
    }
  }, {
    '$limit': 10
  }
];

const leader = [
  {
    '$lookup': {
      'from': 'comments', 
      'localField': '_id', 
      'foreignField': 'commentBy', 
      'as': 'comments'
    }
  }, {
    '$project': {
      '_id': 1, 
      'username': 1, 
      'profilePhotoUrl': 1, 
      'totalComments': {
        '$size': '$comments'
      }
    }
  }, {
    '$sort': {
      'totalComments': -1
    }
  }, {
    '$limit': 10
  }
];

const impact = [
  {
    '$lookup': {
      'from': 'posts', 
      'localField': '_id', 
      'foreignField': 'user', 
      'as': 'posts'
    }
  }, {
    '$lookup': {
      'from': 'comments', 
      'localField': 'posts._id', 
      'foreignField': 'post', 
      'as': 'comments'
    }
  }, {
    '$project': {
      '_id': 1, 
      'username': 1, 
      'profilePhotoUrl': 1, 
      'totalPosts': {
        '$size': '$posts'
      }, 
      'totalComments': {
        '$size': '$comments'
      }
    }
  }, {
    '$project': {
      '_id': 1, 
      'username': 1, 
      'profilePhotoUrl': 1, 
      'avgCommentsPerPost': {
        '$divide': [
          '$totalComments', '$totalPosts'
        ]
      }
    }
  }, {
    '$sort': {
      'avgCommentsPerPost': -1
    }
  }, {
    '$limit': 10
  }
];

module.exports = {
  popular,
  prolific,
  leader,
  impact
};
