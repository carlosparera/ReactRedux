const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryot = require('bcrypt-nodejs');
//Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  pasword: String
});

//on save Hook, encrypt password
userSchema.pre('save', function(next) {
  //get acces to the user model
  const user = this;
  //hash (encrypt) our password using the salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      //overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};
//Create the model class
const ModelClass = mongoose.model('user', userSchema);

//Export
module.exports = ModelClass;
