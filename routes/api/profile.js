const express = require('express');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

const router = express.Router();

// get current users profile
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        ['name', 'avatar']
      );
      if (!profile) {
        return res.status(404).json({ noProfile: 'There is no profile' });
      }

      return res.json(profile);
    } catch (err) {
      return res.status(404).json({ noUser: 'There is no user with that ID' });
    }
  }
);

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

// create or update user profile
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
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
    if (req.body.githubUserName)
      profileFields.githubUserName = req.body.githubUserName;

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
      const profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(updatedProfile);
      } else {
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
      }
    } catch (err) {
      errors.handle = 'Profile doesnt exist';
      return res.status(404).json(errors);
    }
  }
);

// add experience to profile
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
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
  }
);

// add education to profile
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
      } = req.body;
      const newEducation = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
      };

      profile.education.unshift(newEducation);
      const updatedProfile = await profile.save();

      return res.json(updatedProfile);
    } catch (err) {
      errors.handle = 'Profile doesnt exist';
      return res.status(404).json(errors);
    }
  }
);

// delete experience from profile
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ handle: 'Profile doesnt exist' });
      }

      // Find index of experience
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);
      const updatedProfile = await profile.save();

      return res.json(updatedProfile);
    } catch (err) {
      return res.status(404).json({ handle: 'Profile doesnt exist' });
    }
  }
);

// delete education from profile
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ handle: 'Profile doesnt exist' });
      }

      // Find index of education
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1);
      const updatedProfile = await profile.save();

      return res.json(updatedProfile);
    } catch (err) {
      return res.status(404).json({ handle: 'Profile doesnt exist' });
    }
  }
);

// delete user and profile
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOneAndRemove({ user: req.user.id });
      const user = await User.findOneAndRemove({ _id: req.user.id });

      return res.json({ succes: true });
    } catch (err) {
      return res.status(404).json({ handle: 'Profile doesnt exist' });
    }
  }
);

module.exports = router;
