// Create web server application
// with Node.js and Express.js
// Author: TungBT
// Date: 2019/09/15
// Version: 1.0.0
// ========================================
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
router.post('/comment', [auth, [  // Create comment for post
]], async (req, res) => {            // Validate data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return error message
    }
    try {
        const { content, postId } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' }); // Return error message
        }
        const comment = new Comment({
            content,
            user: req.user.id,
            post: postId
        });
        await comment.save();
        post.comments.unshift(comment);
        await post.save();
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error'); // Return error message
    }
}
);
