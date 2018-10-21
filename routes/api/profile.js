const express = require('express');
const passport = require('passport');

const Profile = require('../../models/Profile');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

const router = express.Router();

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.noProfiles = 'There are no profiles';
        res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(() => {
      errors.handle = 'Internal server error';
      return res.status(500).json(errors);
    });
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noProfile = 'Profile doesnt exist';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(() => {
      errors.handle = 'Internal server error';
      return res.status(500).json(errors);
    });
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noProfile = 'Profile doesnt exist';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(() => {
      errors.handle = 'Internal server error';
      return res.status(500).json(errors);
    });
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
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
    profileFields.skills = req.body.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id }).then((profile) => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
        .then(profile => res.json(profile))
        .catch(() => {
          errors.handle = 'Update error';
          return res.status(500).json(errors);
        });
    } else {
      // Create

      // Check if handle exists
      Profile.findOne({ handle: profileFields.handle }).then((profile) => {
        if (profile) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        }

        // Save
        new Profile(profileFields).save()
          .then(profile => res.json(profile))
          .catch(() => {
            errors.handle = 'Creation error';
            return res.status(500).json(errors);
          });
      });
    }
  });
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const {
        title, company, location, from, to, current, description
      } = req.body;
      const newExperience = {
        title, company, location, from, to, current, description
      };

      profile.experience.unshift(newExperience);
      profile.save()
        .then(profile => res.json(profile))
        .catch(() => {
          errors.handle = 'Internal server error';
          return res.status(500).json(errors);
        });
    })
    .catch(() => {
      errors.handle = 'Internal server error';
      return res.status(500).json(errors);
    });
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const {
        school, degree, fieldOfStudy, from, to, current, description
      } = req.body;
      const newEducation = {
        school, degree, fieldOfStudy, from, to, current, description
      };

      profile.experience.unshift(newEducation);
      profile.save()
        .then(profile => res.json(profile))
        .catch(() => {
          errors.handle = 'Internal server error';
          return res.status(500).json(errors);
        });
    })
    .catch(() => {
      errors.handle = 'Internal server error';
      return res.status(500).json(errors);
    });
});

module.exports = router;
