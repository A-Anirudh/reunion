import asyncHandler from "express-async-handler";
import User from '../models/userModel.js'
import {  Post, Comment } from "../models/postModel.js";

const createPost = asyncHandler(async (req,res) => {
    const {title, desc} = req.body;
    const post = await Post.create({
        title,
        desc,
        author: req.user._id
    })
    if(post){
        res.status(201).json({
            _id: post._id,
            title: post.title,
            desc: post.desc,
            createdAt : post.createdAt
        })
    } else{
        res.status(400);
        throw new Error('Invalid data')
    }
})


const createComment = asyncHandler(async (req,res)=>{
    const {comment} = req.body;
    const postId = req.params.id;
    const post = await Post.findOne({_id:postId})
    const newComment = await Comment.create({
        post:postId,
        comment:comment,
        author:req.user._id
    })
    if(newComment){
        if(post){
            post.comments.push(newComment);
            await post.save()
        }
        res.status(201).json({
            _id: newComment._id,
        })
    } else{
        res.status(400);
        throw new Error('Invalid data')
    }
})


const getAllPosts = asyncHandler(async (req,res) => {
    const allPosts =await Post.find({author:req.user._id}).select("-passwords");

    res.status(200).json({
        allPosts
    });
});


const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findOne({_id:postId})
    if(post){
        const user = await User.findOne({_id:post.author})
        if(req.user.email===user.email){
            await Post.deleteOne({_id:postId})
            res.status(201).json("Deleted successfully")
        } else{
            res.status(400)
            throw new Error("User does not own this post to delete")
            
        }
    } else{
        res.status(400)
        throw new Error("Cannot delete! Check ID!!!")
    }
})


const getPostDetail = asyncHandler(async (req,res)=>{
    const postId = req.params.id;
    const post = await Post.findOne({_id : postId});
    if(post){
        res.status(200).json({
            post
        })
    } else{
        res.status(400);
        throw new Error("Post does not exist!")
    }
})

const likePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    const user = await User.findOne({ _id: req.user._id });

    if (!post) {
        res.status(400);
        throw new Error("Cannot find post to like!");
    }

    
    if (post.likedBy.find(item => item==user._id)) {
        res.status(400);
        throw new Error("User has already liked the post! Cannot like it again!");
    }
    post.likedBy.push(user._id)
    post.noOfLikes += 1;
    await post.save();
    

    res.status(201).json("Liked successfully");
});

const unlikePost = asyncHandler(async (req,res) => {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    const user = await User.findOne({ _id: req.user._id });

    if (!post) {
        res.status(400);
        throw new Error("Cannot find post!");
    }

    
    if (!post.likedBy.find(item => item==user._id)) {
        res.status(400);
        throw new Error("Cannot unlike this post!");
    }
    const index = post.likedBy.indexOf(user._id)
    if(index >-1){
        post.likedBy.splice(index,1)
        post.noOfLikes -= 1;
        await post.save();
        res.status(201).json("Unliked successfully");
    }

})

export {getAllPosts,createPost,createComment,deletePost,getPostDetail,likePost,unlikePost};