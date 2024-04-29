let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const cmsController = require('../controllers/cmsController');

router.post('/login', cmsController.login);
router.post('/logout', verifyToken, cmsController.logout);

router.get('/posts', verifyToken, cmsController.get_posts_list);
router.get('/posts/:postid', verifyToken, cmsController.get_post);

router.put('/posts/:postid/publish', verifyToken, handlePublish, cmsController.publish_post);
router.put('/posts/:postid/unpublish', verifyToken, handleUnpublish, cmsController.publish_post);

router.post('/posts', verifyToken, cmsController.create_post);
router.put('/posts/:postid', verifyToken, cmsController.update_post);
router.delete('/posts/:postid', verifyToken, cmsController.delete_post);

router.delete('/posts/:postid/comment/:commentid', verifyToken, cmsController.delete_comment);

function verifyToken(req, res, next) {
  const httpOnlyCookie = req.cookies.token;
  const jsonCookie = httpOnlyCookie ? JSON.parse(httpOnlyCookie) : {};

  if (jsonCookie.token) {
    const cookieToken = jsonCookie.token;
    // verify the token
    jwt.verify(cookieToken, process.env.SECRET, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.token = cookieToken;
        req.authData = authData;
      }
    });
    next();
  } else {
    res.sendStatus(403);
  }

  // const bearerHeader = req.headers['authorization'];
  // // Check if bearer is undefined 
  // if (typeof bearerHeader !== 'undefined') {
  //   const bearer = bearerHeader.split(' ');
  //   const bearerToken = bearer[1];
  //   // verify the token
  //   jwt.verify(bearerToken, process.env.SECRET, (err, authData) => {
  //     if (err) {
  //       res.sendStatus(403);
  //     } else {
  //       req.token = bearerToken;
  //       req.authData = authData;
  //     }
  //   });
  //   next();
  // } else {
  //   res.sendStatus(403);
  // }
};

function handleUnpublish(req, res, next) {
  req.publish = false;
  next();
};

function handlePublish(req, res, next) {
  req.publish = true;
  next();
};

module.exports = router;
