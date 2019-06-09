const Profile = require('../../../models/Profile');
const validateEducationInput = require('../../../validation/education');

const addEducationToProfile = async (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const { school, degree, fieldOfStudy, from, to, current, description } = req.body;
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
};

const deleteEducationFromProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ handle: 'Profile doesnt exist' });
    }

    // Find index of education
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    const updatedProfile = await profile.save();

    return res.json(updatedProfile);
  } catch (err) {
    return res.status(404).json({ handle: 'Profile doesnt exist' });
  }
};

module.exports = { addEducationToProfile, deleteEducationFromProfile };
