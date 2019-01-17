const express = require('express');

const profile = require('./profile');
const education = require('./education');
const experience = require('./experience');
const profileHandler = require('./profileHandler');

const router = express.Router();
router.use('/', profile);
router.use('/education', education);
router.use('/experience', experience);
router.use(profileHandler);

module.exports = router;
