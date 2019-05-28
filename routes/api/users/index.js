const express = require('express');
const passport = require('passport');

const usersController = require('../../../controllers/api/users/users');

const router = express.Router();

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  usersController.getCurrentUser
);

module.exports = router;
