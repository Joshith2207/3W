const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  const { text, imageUrl } = req.body;

  // Validate that at least one field is provided
  if (!text && !imageUrl) {
    return res.status(400).json({ msg: 'Please provide either text content or an image URL for your post' });
  }

  try {
    const newPost = new Post({
      author: req.user.id,
      username: req.user.username,
      text: text ? text.trim() : '',
      imageUrl: imageUrl ? imageUrl.trim() : '',
      likes: [],
      comments: []
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error('Create Post Error:', err.message);
    res.status(500).send('Server Error while creating post');
  }
});

// @route   GET api/posts
// @desc    Get paginated posts (public feed)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // 1. Parse pagination queries with safe default fallbacks
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default to 5 items per slice
    const skip = (page - 1) * limit;

    // 2. Query only the requested slice sorted by newest first (highly efficient on index)
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 3. Count total documents in collection to calculate page metadata
    const totalPosts = await Post.countDocuments();
    
    // 4. Calculate boolean if there are remaining posts online
    const hasMore = skip + posts.length < totalPosts;

    // 5. Send structured response containing both data slice and metadata
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore,
      totalPosts
    });
  } catch (err) {
    console.error('Fetch Posts Error:', err.message);
    res.status(500).send('Server Error while fetching public feed');
  }
});

// @route   POST api/posts/:id/like
// @desc    Like or unlike a post (toggle state)
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.id || req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const username = req.user.username;

    // Check if the user has already liked the post
    const likeIndex = post.likes.indexOf(username);
    
    if (likeIndex > -1) {
      // User has liked it, so unlike it (remove their username)
      post.likes.splice(likeIndex, 1);
    } else {
      // User has not liked it, so like it (add their username)
      post.likes.push(username);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error('Toggle Like Error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error while toggling like');
  }
});

// @route   POST api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ msg: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      username: req.user.username,
      text: text.trim(),
      createdAt: new Date()
    };

    // Add to comments array
    post.comments.push(newComment);

    await post.save();
    // Return the updated comments array
    res.json(post.comments);
  } catch (err) {
    console.error('Add Comment Error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error while adding comment');
  }
});

module.exports = router;
