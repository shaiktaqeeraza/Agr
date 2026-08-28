const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { toggleFollow, getFollowing } = require('../controllers/followController');

router.post('/follow/:userId', auth, toggleFollow);
router.get('/following', auth, getFollowing);

module.exports = router;
