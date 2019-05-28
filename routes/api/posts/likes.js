const express = require('express');
const passport = require('passport');

const likesController = require('../../../controllers/api/posts/likes');

const router = express.Router();

router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  likesController.addLikeToPost
);
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  likesController.removeLikeFromPost
);

module.exports = router;
