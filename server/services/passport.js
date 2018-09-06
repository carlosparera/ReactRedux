const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy({ localOptions }, function(
  email,
  password,
  done
) {
  //Verify this username and password, call done with the user
  //if it is the correct username and password
  //otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) return done(null, false);
    //Compare passwords-is 'password' equal to user.password?
    User.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization')
};
//Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //See if the user id in the payload exists in our database
  //If it does call 'done' with that order
  //otherwise,call dome without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
