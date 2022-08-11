const express = require('express');
const router = express.Router();
const { registerUser, loginUser, followUser, unfollowUser, updateUser } = require('../controllers/userController.js')
const { postCreate, likePost, updatePost, deletePosts } = require('../controllers/postController.js')
const { createComment, createSubComment } = require('../controllers/commentController.js')

//------------------------user----------------------------
router.post("/register", registerUser);
router.post("/login", loginUser)
router.put("/updateUser/:userId", updateUser)
router.put('/follow/:userId', followUser)
router.patch('/unFollow/:userId', unfollowUser)

//------------------------post----------------------------
router.post("/createPost/:userId", postCreate)
router.patch("/likePost/:userId", likePost)
router.put("/updatePost/user/:userId/post/:postId", updatePost)
router.delete("/deletePost/user/:userId/post/:postId",deletePosts)

//----------------------comment--------------------------
router.post("/createComment/user/:userId/post/:postId", createComment);

//-----------------------sub-comment--------------------
router.post("/createSubComment/user/:userId/comment/:commentId", createSubComment);

module.exports = router;