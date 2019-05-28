const express = require('express');
const passport = require('passport');

const educationController = require('../../../controllers/api/profile/education');

const router = express.Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  educationController.addEducationToProfile
);
router.delete(
  '/:edu_id',
  passport.authenticate('jwt', { session: false }),
  educationController.deleteEducationFromProfile
);

module.exports = router;
