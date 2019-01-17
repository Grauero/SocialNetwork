const express = require('express');
const passport = require('passport');

const Profile = require('../../../models/Profile');
const User = require('../../../models/User');
const validateProfileInput = require('../../../validation/profile');

const router = express.Router();

// get current users profile
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar'
    ]);
    if (!profile) {
      return res.status(404).json({ noProfile: 'There is no profile' });
    }

    return res.json(profile);
  } catch (err) {
    return res.status(404).json({ noUser: 'There is no user with that ID' });
  }
});

// create or update user profile
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubUserName) profileFields.githubUserName = req.body.githubUserName;

  // Skills
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  try {
    const user = await Profile.findOne({ user: req.user.id });

    if (user) {
      // Update
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(updatedProfile);
    }
    // Create

    // Check if handle exists
    const profile = await Profile.findOne({ handle: profileFields.handle });

    if (profile) {
      errors.handle = 'That handle already exists';
      return res.status(400).json(errors);
    }

    // Save profile
    const newProfile = await new Profile(profileFields).save();

    return res.json(newProfile);
  } catch (err) {
    errors.handle = 'Profile doesnt exist';
    return res.status(404).json(errors);
  }
});

// delete user and profile
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json({ succes: true });
  } catch (err) {
    return res.status(404).json({ handle: 'Profile doesnt exist' });
  }
});

module.exports = router;
