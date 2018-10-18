const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/User');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');

const router = express.Router();

// @route   POST api/users/register
// @desc    Register user
// @access  public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email } = req.body;
  const { password } = req.body;

  User.findOne({ email })
    .then((user) => {
      // check user
      if (user) {
        errors.email = 'That email already exists';
        return res.status(400).json(errors);
      }

      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'm' // default
      });
      const newUser = new User({
        name, password, email, avatar
      });

      // hashing password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          // saving new user to DB
          newUser.save()
            .then(user => res.json(user))
            .catch(() => {
              errors.email = 'Error while registering';
              res.status(400).json(errors);
            });
        });
      });
    })
    .catch(() => {
      errors.email = 'Error while registering';
      res.status(500).json(errors);
    });
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT
// @access  public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      // check user
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }

      // check password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          // user and password matched
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }; // JWT payload

            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) {
                  return res.status(500).json({ success: false, token: 'didnt get JWT' });
                }
                return res.status(200).json({ success: true, token: `Bearer ${token}` });
              }
            );
          } else {
            return res.status(400).json({ password: 'Password incorrect' });
          }
        });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});


module.exports = router;
