import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createComment, createPost, deletePost, getAllPosts, getPostDetail, likePost,unlikePost } from "../controllers/postController.js";
const postRouter = express.Router();

postRouter.get('/all_posts',protect, getAllPosts);
postRouter.post('/posts',protect,createPost);
postRouter.post('/comment/:id', protect, createComment)
postRouter.delete('/posts/:id',protect, deletePost)
postRouter.get('/posts/:id',protect, getPostDetail)
postRouter.post('/like/:id',protect,likePost)
postRouter.post('/unlike/:id',protect,unlikePost)

// postRouter.route('/user').get(protect,getUserProfile).put(protect,updateUserProfile);

export default postRouter