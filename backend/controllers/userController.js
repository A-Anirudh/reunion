import asyncHandler from "express-async-handler";
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

/**
 * @desc Auth user/set token
* @route  POST to /api/users/auth
* @Access Public
*/
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(user && (await user.matchPasswords(password))){
        let token = generateToken(res, user._id,'user');
        return res.status(201).json({
            JWT: token
        });
    } else{
        res.status(401);
        throw new Error('Invalid email or password')
    }
});

/**
 * @desc Register a new user
 * @route POST to /api/users
 * @access Public
 * @params - email, password, firstName, lastName, phoneNumber, dateOfBirth, gender, state, bloodGroup, city, pincode
 */

const registerUser = asyncHandler(async (req, res) => {
    const {email,password,firstName, lastName, phoneNumber, dateOfBirth, gender, state, bloodGroup, city, pincode } = req.body;
    const userExists = await User.findOne({email});
    
    if (phoneNumber.length !==10){
        res.status(400);
        throw new Error("Phone number should be only 10 digits. Do no include country code!")
    }

    if(userExists){
        res.status(400);
        throw new Error('user already exists!');
        // Uses our error handler that we created
    }

    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth, 
        gender, 
        state, 
        bloodGroup, 
        city, 
        pincode
    });
    if(user){
        generateToken(res, user._id,'user');
        res.status(201).json({
            _id:user._id,
            firstName: user.firstName,
            email:user.email,

        });
    } else{
        res.status(400);
        throw new Error('Invalid user data!')
    }
});

/**
 * @desc Logout
 * @route POST to  /api/users/logout
 * @access Public
 */

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt-user','',{
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({message:"User logged out"})

});

/**
 * @desc get user profile
 * @route GET to /api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id :req.user._id,
        email :req.user.email,
        firstName:req.user.firstName,
        lastName:req.user.lastName,
        phoneNumber:req.user.phoneNumber,
        followers: req.user.followers,
        following : req.user.following,
        noOfFollowers : req.user.followers.length,
        noOfFollowing : req.user.following.length
    }
    // console.log(user)
    res.status(200).json(user)

});

/**
 * @desc Update User Profile
 * @route PUT to /api/users/profile
 * @access Private
 */

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;        
        user.email = req.body.email || user.email;
        user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
        user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
        user.gender = req.body.gender || user.gender;
        user.state = req.body.state || user.state;
        user.city = req.body.city || user.city;
        user.pincode = req.body.pincode || user.pincode;  
        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email
        })
    } else{
        res.status(404);
        throw new Error('User not found')
    }
});

const followUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    const followUserId = req.params.id;
    const currentUser = await User.findOne({_id:currentUserId});
    const followUser = await User.findOne({_id:followUserId});

    if(currentUser.following.includes(followUser._id)){
        res.status(400)
        throw new Error("You already follow the user!")
    } else{
        currentUser.following.push(followUser._id)
        followUser.followers.push(currentUser._id)
        currentUser.save();
        followUser.save();

        res.status(200).json("Following success")
    }
})

const unfollowUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    const unfollowUserId = req.params.id;
    const currentUser = await User.findOne({_id:currentUserId});
    const unfollowUser = await User.findOne({_id:unfollowUserId});

    if(currentUser.following.includes(unfollowUser._id)){
        const index = currentUser.following.indexOf(unfollowUserId)
        const findex = unfollowUser.followers.indexOf(currentUserId)
        if(index>-1 && findex>-1){
            currentUser.following.splice(index,1);
            unfollowUser.followers.splice(findex,1);
            currentUser.save();
            unfollowUser.save();
            res.status(200).json("unfollow success")
        }
    } else{
        res.status(400).json("You are not following the person")
    }
})
export {authUser, registerUser, logoutUser, getUserProfile, updateUserProfile,followUser,unfollowUser};