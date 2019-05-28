const express = require('express');
const passport = require('passport');

const commentsController = require('../../../controllers/api/posts/comments');

const router = express.Router();

router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  commentsController.addComentToPost
);
router.delete(
  '/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  commentsController.removeCommentFromPost
);

module.exports = router;
