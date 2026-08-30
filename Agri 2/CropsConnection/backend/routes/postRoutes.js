const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/postController');

// optional auth: attach user if token present, but don't block
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    try {
      req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    } catch (e) {
      req.user = null;
    }
  }
  next();
};

router.get('/posts', optionalAuth, getPosts);
router.post('/posts', auth, upload.single('cropImage'), createPost);
router.put('/posts/:id', auth, upload.single('cropImage'), updatePost);
router.delete('/posts/:id', auth, deletePost);

module.exports = router;
