const Authentication = require('./controllers/authentication');
const passportService = require('passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send();
  });
  app.post('/signin', Authentication.signup);
  app.post('/signup', Authentication.signup);
};
