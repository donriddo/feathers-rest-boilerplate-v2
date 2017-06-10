// user-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const user = new mongooseClient.Schema({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { type: String, enum: ['saas', 'admin', 'customer'], default: 'customer' },

    isDeleted: { type: Boolean, default: false },

    googleId: { type: String },

    facebookId: { type: String },

    githubId: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  return mongooseClient.model('user', user);
};
