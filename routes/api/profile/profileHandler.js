const express = require('express');

const Profile = require('../../../models/Profile');

const router = express.Router();

// get all profiles
router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    if (profiles.length === 0) {
      return res.status(404).json({ noProfiles: 'There are no profiles' });
    }

    return res.json(profiles);
  } catch (err) {
    return res.status(404).json({ noProfiles: 'There are no profiles' });
  }
});

// get profile by handle
router.get('/handle/:handle', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      handle: req.params.handle
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(404).json({ noProfile: 'Profile doesnt exist' });
    }

    return res.json(profile);
  } catch (err) {
    return res.status(404).json({ handle: 'Profile doesnt exist' });
  }
});

// get profile by user ID
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(404).json({ noProfile: 'Profile doesnt exist' });
    }

    return res.json(profile);
  } catch (err) {
    return res.status(404).json({ handle: 'User doesnt exist' });
  }
});

module.exports = router;
