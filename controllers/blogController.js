const { isValidObjectId } = require('mongoose');
const Post = require('../models/post');
const Comment = require('../models/comment');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');

exports.get_posts_list = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ 'published': true }).exec();
  if (!posts) {
    res.sendStatus(404);
  } else {
    res.json({ posts });
  }
});

exports.get_post = asyncHandler(async (req, res, next) => {
  if (!req.params.postid || !isValidObjectId(req.params.postid)) {
    res.sendStatus(400);
  } else {
    const [post, comments] = [
      await Post.findById(req.params.postid).exec(),
      await Comment.find({ 'post': req.params.postid }).sort({ 'timestamp': -1 }).exec(),
    ]
    if (!post) {
      res.sendStatus(404);
    } else {
      if (!post.published) {
        res.sendStatus(403);
      } else {
        res.json({ post, comments });
      }
    }
  }
});

exports.post_comment = asyncHandler(async (req, res, next) => {
  if (!req.params.postid || !isValidObjectId(req.params.postid) || !req.body.author || !req.body.content) {
    res.sendStatus(400);
  } else {
    const post = await Post.findById(req.params.postid).exec();
    if (!post) {
      res.sendStatus(404);
    } else {
      if (!post.published) {
        res.sendStatus(403);
      } else {
        const comment = new Comment({
          author: req.body.author,
          timestamp: new Date(),
          post: req.params.postid,
          content: req.body.content
        });
        await comment.save();
        res.json({ result: 'done' });
      }
    }
  }
});