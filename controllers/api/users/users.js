const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../../models/User');
const keys = require('../../../config/keys');
const validateRegisterInput = require('../../../validation/register');
const validateLoginInput = require('../../../validation/login');

const registerUser = async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

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
      name,
      password,
      email,
      avatar
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    newUser.password = hashedPassword;

    const savedUser = await newUser.save();

    return res.json(savedUser);
  } catch (err) {
    errors.obj = err;
    errors.email = 'Error while registering';
    return res.status(400).json(errors);
  }
};

const loginUser = async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // JWT payload
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      };

      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        if (err) {
          errors.token = 'didnt get JWT';
          return res.status(500).json(errors);
        }

        return res.status(200).json({ success: true, token: `Bearer ${token}` });
      });
    } else {
      errors.password = 'Password incorrect';
      return res.status(400).json(errors);
    }
  } catch (err) {
    errors.login = 'Invalid login';
    return res.status(400).json(errors);
  }
};

const getCurrentUser = (req, res) => {
  const { _id, name, email } = req.user;

  return res.json({ _id, name, email });
};

module.exports = { registerUser, loginUser, getCurrentUser };
