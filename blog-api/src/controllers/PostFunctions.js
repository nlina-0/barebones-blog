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
    try {
        return await Post.findByIdAndUpdate(postDetails.postID, postDetails.updatedData, { new: true }).exec()
    } catch (error) {
        console.error("Error updating post: ", error)
        throw error
    }
    
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