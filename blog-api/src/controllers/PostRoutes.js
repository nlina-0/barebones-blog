import express, { Router } from "express"
import { 
    getAllPosts,
    getPostById, 
    getPostsByAuthor,
    createPost, 
    updatePost, 
    deletePost
} from "./PostFunctions.js"

const router = Router()

// Show all posts
router.get('/', async (req, res) => {
    let allPosts = await getAllPosts()

    res.json({
        postsCount: allPosts.length,
        postsArray: allPosts
    })
})

// Show posts by specific user
router.get('/author/:authorID', async (req, res) => {
    let postsByAuthor = await getPostsByAuthor(req.params.authorID)

    res.json({
        postsCount: postsByAuthor.length,
        postsArray: postsByAuthor
    })
})

// Show specific post by ID
router.get('/:postID', async (req, res) => {
    res.json(await getPostById(req.params.postID))
})

// Create a post
// TODO: Not working, not saving any content
router.post('/', async (req, res) => {
    res.json(await createPost(req.body.postDetails))
})

// Update a specific post
router.put('/:postID', async (req, res) => {
    let postDetails = {
        postID: req.params.postID,
        updatedData: req.body.newPostData
    }

    res.json(await updatePost(postDetails))
})

// Delete a specific post
router.delete('/:postID', async (req, res) => {
    res.json(await deletePost(req.params.postID))
})

export default router