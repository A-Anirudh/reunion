import express from "express";
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, followUser, unfollowUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/register', registerUser);
router.post('/authenticate', authUser);
router.post('/logout', logoutUser);
router.route('/user').get(protect,getUserProfile).put(protect,updateUserProfile);
router.post('/follow/:id',protect,followUser)
router.post('/unfollow/:id',protect,unfollowUser)


export default router 