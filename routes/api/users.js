const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const keys = require('../../config/keys');

const router = express.Router();

router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

router.post('/register', (req, res) => {
  const { name, email } = req.body;
  let { password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: 'That email already exists' });
      }

      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'm', // default
      });
      const newUser = new User({
        name, password, email, avatar,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          password = hash;
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    });
});

router.post('login', (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }

      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            return res.status(200).json({ success: true });
          }
          return res.status(400).json({ password: 'Password incorrect' });
        });
    });
});

module.exports = router;
