let express = require('express');
let router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.get_posts_list);

router.get('/last/:number', blogController.get_last_posts_list)

router.get('/:postid', blogController.get_post);

router.post('/:postid/comment', blogController.post_comment)

module.exports = router;
