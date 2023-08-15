import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Post'

    },
    comment:{
        type:String,
        required:true,
    },
    author :{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
},{
    timestamps: true
});


const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true,
    },
    author :{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    comments :{
        type: [commentSchema],
        default: []
    },
    noOfLikes:{
        type:Number,
        default:0
    },
    likedBy:{
        type:[String],
        default:[]
    }
},{
    timestamps: true
});

const Comment = mongoose.model('commentSchema', commentSchema);
const Post = mongoose.model('Post', postSchema);
export {Post,Comment};