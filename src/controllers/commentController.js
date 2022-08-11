const commentModel = require('../models/commentModel.js')
const postModel = require('../models/postModel.js')
const userModel = require('../models/userModel.js')
const { isValidInputBody } = require('../validations/validation.js')

const createComment = async function (req, res) {
    try {
        let userId = req.params.userId;
        let user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res
                .status(400)
                .send({ status: false, message: "User doesn't exist" });
        }

        let postId = req.params.postId;
        let post = await postModel.findOne({ _id: postId })

        if (!post) {
            return res
                .status(400)
                .send({ status: false, message: "Post doesn't exist" });
        }

        let data = req.body;

        if (!data) {
            return res.status(400).send({ status: false, message: "Please comment something" })
        }
        data["userId"] = userId
        data["postId"] = postId
        
        let commentCreated = await commentModel.create(data)
        let commentPush = {
            "UserName": user.user_name,
            "Comment": data.comment,
            "Date": commentCreated.createdAt
        }
        post.comment.push(commentPush)
        post.save()

        // await postModel.findOne
        

        return res.status(201).send({status: true, msg: "commented on Post", data: commentCreated})
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const createSubComment = async function (req, res) {
    try {
        let userId = req.params.userId;
        let user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res
                .status(400)
                .send({ status: false, message: "User doesn't exist" });
        }

        let commentId = req.params.commentId;
        let comment = await commentModel.findOne({ _id: commentId })

        if (!comment) {
            return res
                .status(400)
                .send({ status: false, message: "Comment doesn't exist" });
        }

        let data = req.body;

        if (!data) {
            return res.status(400).send({ status: false, message: "Please comment something" })
        }
        data["userId"] = userId
        data["postId"] = comment.postId
        data["commentId"] = commentId
        
        let commentCreated = await commentModel.create(data)
        let commentPush = {
            "UserName": user.user_name,
            "Comment": data.comment,
            "Date": commentCreated.createdAt
        }
        comment.subComment.push(commentPush)
        comment.save()

        // await postModel.findOne
        

        return res.status(201).send({status: true, msg: "commented on Comment", data: commentCreated})
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createComment, createSubComment }
