const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getConversation, getConversationsList, sendMessage } = require('../controllers/messageController');

router.get('/messages/conversations', auth, getConversationsList);
router.get('/messages/:userId', auth, getConversation);
router.post('/messages', auth, sendMessage);

module.exports = router;
