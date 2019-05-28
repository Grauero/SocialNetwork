const express = require('express');

const profileHandlerController = require('../../../controllers/api/profile/profileHandler');

const router = express.Router();

router.get('/all', profileHandlerController.getAllProfiles);
router.get('/handle/:handle', profileHandlerController.getProfileByHandle);
router.get('/user/:user_id', profileHandlerController.getProfileById);

module.exports = router;
