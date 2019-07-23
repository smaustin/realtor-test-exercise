const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');

// TODO create env var for api url
const url = 'http://localhost:4001';

// TODO may need try/catch with async/await for proper error handling
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, cb) => {
      axios
        .get(`${url}/users?email=${email}`)
        .then(res => {
          const user = res.data[0];
          if (!user) {
            return cb(null, false, { message: 'Invalid username or password' });
          }
          if (user.password != password) {
            return cb(null, false, { message: 'Invalid username or password'  });
          }
          return cb(null, user);
        })
        .catch (err => {
          cb(err);
        });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  axios.get(`${url}/users/${id}`)
  .then(res => cb(null, res.data))
  .catch (err => cb(err, false))
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  authenticate: (strategy, options) => {
    return passport.authenticate(strategy, options);
  },
  setUser: (req, res, next) => {
    res.locals.user = req.user;
    return next();
  }
};
