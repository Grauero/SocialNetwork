const express = require('express');
const passport = require('passport');

const Profile = require('../../../models/Profile');
const validateExperienceInput = require('../../../validation/experience');

const router = express.Router();

// add experience to profile
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const { title, company, location, from, to, current, description } = req.body;
    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    profile.experience.unshift(newExperience);
    const updatedProfile = await profile.save();

    return res.json(updatedProfile);
  } catch (err) {
    errors.handle = 'Profile doesnt exist';
    return res.status(404).json(errors);
  }
});

// delete experience from profile
router.delete('/:exp_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ handle: 'Profile doesnt exist' });
    }

    // Find index of experience
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    const updatedProfile = await profile.save();

    return res.json(updatedProfile);
  } catch (err) {
    return res.status(404).json({ handle: 'Profile doesnt exist' });
  }
});

module.exports = router;
