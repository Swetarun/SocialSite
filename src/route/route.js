const express = require('express');
const router = express.Router();
const {authentication} = require('../middleware/authentication.js')
const { registerUser, loginUser, followUser, unfollowUser, updateUser } = require('../controllers/userController.js')
const { postCreate, likePost,likedBy, getList, getMyLikedList, updatePost, deletePosts } = require('../controllers/postController.js')
const { createComment, createSubComment } = require('../controllers/commentController.js')

//------------------------user----------------------------
router.post("/register", registerUser);
router.post("/login", loginUser)
router.put("/updateUser/:userId", authentication, updateUser)
router.put('/follow/:userId', authentication ,followUser)
router.patch('/unFollow/:userId', authentication ,unfollowUser)

//------------------------post----------------------------
router.post("/createPost/:userId", authentication , postCreate)
router.patch("/likePost/:userId", authentication, likePost)
router.get("/likedBy/user/:userId/post/:postId", authentication, likedBy)
router.get("/getList/:userId", authentication, getList)
router.get("/getMyLikedList/:userId", authentication, getMyLikedList)
router.put("/updatePost/user/:userId/post/:postId", authentication , updatePost)
router.delete("/deletePost/user/:userId/post/:postId", authentication ,deletePosts)

//----------------------comment--------------------------
router.post("/createComment/user/:userId/post/:postId", authentication , createComment);

//-----------------------sub-comment--------------------
router.post("/createSubComment/user/:userId/comment/:commentId", authentication , createSubComment);

module.exports = router;

//mongoose-skip/limit