const express = require('express');
const passport = require('passport');

const experienceController = require('../../../controllers/api/profile/experience');

const router = express.Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  experienceController.addExperienceToProfile
);
router.delete(
  '/:exp_id',
  passport.authenticate('jwt', { session: false }),
  experienceController.deleteExperienceFromProfile
);

module.exports = router;
