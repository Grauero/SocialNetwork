const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/User');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const router = express.Router();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, password } = req.body;

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
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      // check user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // check password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          // user and password matched
          if (isMatch) {
            // JWT payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };

            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) {
                  errors.token = 'didnt get JWT';
                  return res.status(500).json(errors);
                }
                return res.status(200).json({ success: true, token: `Bearer ${token}` });
              }
            );
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { _id, name, email } = req.user;

  res.json({ _id, name, email });
});

module.exports = router;
