const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { isValidObjectId } = require('mongoose');

exports.login = asyncHandler(async (req, res, next) => {
  // check the query args presence
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400);
  } else {
    // check if any user exists with the given username
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      res.sendStatus(404);
    } else {
      // check if the passwords match
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        res.sendStatus(401)
      } else {
        // send back the JWT
        jwt.sign({ user }, process.env.SECRET, { expiresIn: '10m' }, (err, token) => {
          res.json({ token });
        });
      }
    }
  }
});

exports.get_posts_list = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().exec();
  if (!posts) {
    res.sendStatus(404);
  } else {
    res.json({ posts });
  }
});

exports.get_post = asyncHandler(async (req, res, next) => {
  // Check if the post id is given 
  if (!req.params.postid || !isValidObjectId(req.params.postid)) {
    res.sendStatus(400);
  } else {
    const [post, comments] = [
      await Post.findById(req.params.postid).exec(),
      await Comment.find({ 'post': req.params.postid }).sort({ 'timestamp': -1 }).exec(),
    ]
    if (!post) {
      res.sendStatus(404)
    } else {
      res.json({ post, comments });
    }
  }
});

exports.publish_post = asyncHandler(async (req, res, next) => {
  // Check if the post id is given 
  if (!req.params.postid || !isValidObjectId(req.params.postid)) {
    res.sendStatus(400);
  } else {
    // Get the post from the DB and update its published value
    const post = await Post.findById(req.params.postid).exec();
    if (!post) {
      res.sendStatus(404)
    } else {
      post.published = req.publish;
      await Post.findByIdAndUpdate(post._id, post);
      res.json({ result: 'done', published: req.publish, url: post.url });
    }
  }
});

exports.create_post = asyncHandler(async (req, res, next) => {
  // check the query args presence
  if (!req.body.title || !req.body.content) {
    res.sendStatus(400);
  } else {
    const newPost = new Post({
      author: req.authData.user._id, // user's id from the token
      timestamp: new Date(),
      title: req.body.title,
      content: req.body.content,
      published: false
    });
    const createdPost = await newPost.save();
    res.json({ result: 'done', id: createdPost._id, url: createdPost.url })
  }
});

exports.update_post = asyncHandler(async (req, res, next) => {
  // check the query args presence
  if (!req.params.postid || !isValidObjectId(req.params.postid) || !req.body.title || !req.body.content) {
    res.sendStatus(400);
  } else {
    // check if the post exists
    const post = await Post.findById(req.params.postid).exec();
    if (!post) {
      res.sendStatus(404);
    } else {
      // updates the post
      post.title = req.body.title;
      post.content = req.body.content;
      post.timestamp = new Date();
      await Post.findByIdAndUpdate(req.params.postid, post).exec();
      res.json({ result: 'done', url: post.url });
    }
  }
});

exports.delete_post = asyncHandler(async (req, res, next) => {
  // check the query args presence
  if (!req.params.postid || !isValidObjectId(req.params.postid)) {
    res.sendStatus(400);
  } else {
    // check if the post exists
    const post = await Post.findById(req.params.postid).exec();
    if (!post) {
      res.sendStatus(404);
    } else {
      await Post.findByIdAndDelete(req.params.postid).exec();
      res.json({ result: 'done' });
    }
  }
});

exports.delete_comment = asyncHandler(async (req, res, next) => {
  // check the query args presence
  if (!req.params.postid || !isValidObjectId(req.params.postid) || !req.params.commentid || !isValidObjectId(req.params.commentid)) {
    res.sendStatus(400);
  } else {
    // check if the post exists
    const [post, comment] = [
      await Post.findById(req.params.postid).exec(),
      await Comment.findById(req.params.commentid).exec()
    ];
    if (!post || !comment) {
      res.sendStatus(404);
    } else {
      await Comment.findByIdAndDelete(req.params.commentid).exec();
      res.json({ result: 'done' });
    }
  }
});