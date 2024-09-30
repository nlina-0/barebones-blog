import { Post } from "../models/PostModels.js"

// Returns all Posts
async function getAllPosts() {
    return await Post.find({}).exec()
}

// Get post by ID
async function getPostById(postID) {
    return await Post.findById(postID).exec()
}

// Get post by user ID (author)
async function getPostsByAuthor(userID) {
    return await Post.find({author: userID}).exec()
}

// Create post
async function createPost(postDetails) {
    return await Post.create(postDetails)
}

// Update post
async function updatePost(postDetails) {
    // Find user, update it, return the updated user data.
    return await Post.findByIdAndUpdate(postDetails.postID, postDetails.updatedData, {returnDocument: 'after'}).exec()
}

// Delete post
async function deletePost(postID) {
    return await Post.findByIdAndDelete(postID).exec()
}

export { 
    getAllPosts,
    getPostById, 
    getPostsByAuthor,
    createPost, 
    updatePost, 
    deletePost
}