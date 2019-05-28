const Profile = require('../../../models/Profile');

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    if (profiles.length === 0) {
      return res.status(404).json({ noProfiles: 'There are no profiles' });
    }

    return res.json(profiles);
  } catch (err) {
    return res.status(404).json({ noProfiles: 'There are no profiles' });
  }
};

const getProfileByHandle = async (req, res) => {
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
};

const getProfileById = async (req, res) => {
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
};

module.exports = { getAllProfiles, getProfileByHandle, getProfileById };
