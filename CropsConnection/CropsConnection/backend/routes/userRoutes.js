const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getUsers, getProfile, updateProfile } = require('../controllers/userController');

router.get('/users', auth, getUsers);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('profileImage'), updateProfile);

module.exports = router;
