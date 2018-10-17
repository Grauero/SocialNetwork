const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

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

module.exports = router;
