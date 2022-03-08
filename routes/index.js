const express = require('express');
const router = express.Router();
const userController = require('../controllers/Users');
const commentController = require('../controllers/Comments/index.js');
const communityController = require('../controllers/Community');
const postController = require('../controllers/Posts/index.js');
const likeController = require('../controllers/Likes/index.js');
const configMulter = require('../middlewares/multer');
const multer = require('multer');


router.post('/post/register', multer(configMulter).single('file'), postController.register);
router.get('/post/:id/:user', postController.getPost);
router.get('/posts/:id/:page', postController.getByCommunity);
router.post('/posts/', postController.getPosts);
router.post('/post/deletePost', postController.deletePost);


router.post('/comment/register',  commentController.register);
router.get('/comments/:id', commentController.getComments);
router.post('/comment/deleteComment', commentController.deleteComment);


router.post('/community/register', communityController.register);
router.get('/community/sub/:id', communityController.sub);
router.get('/community/:id/:page/:user', communityController.getCommunityAndPost);
router.get('/communities', communityController.getCommunities);
router.get('/community/:id', communityController.getCommunity);
router.post('/communities/filter', communityController.getCommunitiesByParam);


router.post('/user/register', userController.register);
router.get('/user/get/:user', userController.getUser);
router.post('/user/edit', multer(configMulter).single('file'), userController.editProfile);

router.get('/like/:id', likeController.like);
router.get('/dislike/:id', likeController.dislike);


router.post('/login', userController.login);

module.exports = router;