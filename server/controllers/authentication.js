const User = require('../models/user');
const jwt = require('jwt-simple');
const config = rwuire('../config');

function tokenForUser(user) {
  const timestamp = new Date.getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  //User has already had their email and password auth'd
  //We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'You must provide email and password' });
  }

  //see if user with given email exists
  //if a user with email  does exist, return an error
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }
  });
  //if a user with email does NOT EXIST,  create and save record
  const user = new User({
    email: email,
    password: password
  });
  user.save(function(err) {
    if (err) {
      return next(err);
    }
    res.json({ token: tokenForUser(user) });
  });
  //Respond to request indicating the user was created
};
