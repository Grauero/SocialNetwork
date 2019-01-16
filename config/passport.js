const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');
const keys = require('./keys');

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = keys.secretOrKey;

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id);

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (err) {
    done(err, false, { email: 'Error while authorizing', err: err.message });
  }
});

function applyPassportStrategies(passport) {
  passport.use(jwtStrategy);
}

module.exports = applyPassportStrategies;
