const express = require('express');
const passport = require('passport');

const profileController = require('../../../controllers/api/profile/profile');

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), profileController.getUserProfile)
  .post(passport.authenticate('jwt', { session: false }), profileController.createUserProfile)
  .delete(passport.authenticate('jwt', { session: false }), profileController.deleteUserProfile);

router.post(
  '/message',
  passport.authenticate('jwt', { session: false }),
  profileController.sendMessage
);
router.delete(
  '/message/:id',
  passport.authenticate('jwt', { session: false }),
  profileController.deleteMessage
);

module.exports = router;
