const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create client/img/posts directory if it doesn't exist
const uploadDir = 'client/img/posts';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `post-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File too large. Maximum size is 5MB.' });
    }
  } else if (err.message === 'Only images are allowed!') {
    return res.status(400).json({ msg: 'Only images are allowed!' });
  }
  next(err);
};

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .populate('author', 'username role')
      .sort({ created_at: -1 })
      .limit(parseInt(limit));

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username role avatar_theme')
      .populate('comments.user', 'username avatar_theme');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post (All users can post)
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // Handle multer errors
    if (req.fileValidationError) {
      return res.status(400).json({ msg: req.fileValidationError });
    }

    const { title, content, category, tags, image_url } = req.body;

    // Handle tags - they might come as string or array
    let processedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          processedTags = JSON.parse(tags);
        } catch (e) {
          processedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(tags)) {
        processedTags = tags;
      }
    }

    const post = new Post({
      title,
      content,
      category: category || 'Updates',
      author: req.user.id,
      tags: processedTags,
      image_url: req.file ? `/img/posts/${req.file.filename}` : (image_url || null)
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username role');

    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (Author or Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this post' });
    }

    const { title, content, category, tags, image_url } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (image_url !== undefined) post.image_url = image_url || null;
    post.updated_at = Date.now();

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username role');

    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Author or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this post' });
    }

    // Log deletion reason if provided (for admin deletions)
    if (req.body.reason && req.user.role === 'admin') {
      console.log(`Post ${req.params.id} deleted by admin ${req.user.id}. Reason: ${req.body.reason}`);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if already liked
    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
      
      // Create notification for post author (if not the same person)
      if (post.author.toString() !== req.user.id) {
        try {
          console.log('🔥 POST LIKE: Creating notification for post author:', post.author);
          console.log('🔥 POST LIKE: Liked by:', req.user.username, req.user.id);
          const notification = new Notification({
            user_id: post.author,
            type: 'post_liked',
            title: 'Your post was liked!',
            message: `${req.user.username} liked your post`,
            data: {
              postId: post._id,
              likedBy: req.user.id,
              likedByUsername: req.user.username
            }
          });
          await notification.save();
          console.log('✅ POST LIKE: Notification created successfully:', notification._id);
        } catch (notificationError) {
          console.error('❌ POST LIKE: Error creating notification:', notificationError);
        }
      }
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.comments.push({
      user: req.user.id,
      text
    });

    // Create notification for post author (if not the same person)
    if (post.author.toString() !== req.user.id) {
      try {
        console.log('🔥 POST COMMENT: Creating notification for post author:', post.author);
        console.log('🔥 POST COMMENT: Commented by:', req.user.username, req.user.id);
        console.log('🔥 POST COMMENT: Comment text:', text);
        const notification = new Notification({
          user_id: post.author,
          type: 'post_commented',
          title: 'New comment on your post!',
          message: `${req.user.username} commented on your post`,
          data: {
            postId: post._id,
            commentBy: req.user.id,
            commentByUsername: req.user.username,
            commentText: text
          }
        });
        await notification.save();
        console.log('✅ POST COMMENT: Notification created successfully:', notification._id);
      } catch (notificationError) {
        console.error('❌ POST COMMENT: Error creating notification:', notificationError);
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username role')
      .populate('comments.user', 'username avatar_theme');

    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/posts/:id/pin
// @desc    Pin/unpin a post (Admin only)
// @access  Private (Admin only)
router.put('/:id/pin', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Toggle pin status
    post.isPinned = !post.isPinned;
    post.pinnedBy = post.isPinned ? req.user.id : null;
    post.pinnedAt = post.isPinned ? new Date() : null;

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username role')
      .populate('pinnedBy', 'username');

    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

