import express, { Router } from "express"
import { 
    getAllPosts,
    getPostById, 
    getPostsByAuthor,
    createPost, 
    updatePost, 
    deletePost
} from "./PostFunctions.js"
import jwt from "jsonwebtoken"
import { Role } from "../models/RoleModels.js"
import { Post } from "../models/PostModels.js"
import { verifyUserJWT, decryptString  } from "./UserFunctions.js"
import { User } from "../models/UserModels.js"

const router = Router()

// --------------------------------------
// ----- Middleware

const verifyJwtHeader = async (req, res, next) => {
    let rawJwtHeader = req.headers.jwt
    let jwtRefresh = await verifyUserJWT(rawJwtHeader)
    req.headers.jwt = jwtRefresh
    next()
}

const verifyJwtRole = async (req, res, next) => {
    // Verify that the JWT is still valid.
    let userJwtVerified = jwt.verify(req.headers.jwt, process.env.JWT_SECRET, {complete: true})

    // Decrypt the encrypted payload.
    let decryptedJwtPayload = decryptString(userJwtVerified.payload.data)

    // Parse the decrypted data into an object.
    let userData = JSON.parse(decryptedJwtPayload)

    // Because the JWT doesn't include role info, we must find the full user document first:
    let userDoc = await User.findById(userData.userID).exec()
    let userRoleName = await Role.findById(userDoc.role).exec()

    // Attach the role to the req for the backend to use.
    // Note that the user's role will never be available on the front-end
    // with this technique.
    // This means they can't just manipulate the JWT to access admin stuff.
    console.log("User role is: " + userRoleName.name)
    req.headers.userRole = userRoleName.name
    req.headers.userID = userDoc.id.toString()

    next()
}

// Throw to the error-handling middleware if the user is not authorized.
// Different middleware can be made for different roles, just like this.
const onlyAllowAdminOrAuthor = async (req, res, next) => {
    let postAuthor = await Post.findById(req.params.postID).exec().then((data) => {return data.author})

    if (req.headers.userRole == "admin" || postAuthor == req.headers.userID){
        next()
    } else {
        next(new Error("User not authorized."))
    }
}

// Show all posts
router.get('/', async (req, res) => {
    // let allPosts = await getAllPosts()

    // res.json({
    //     // postsCount: allPosts.length,
    //     postsArray: allPosts
    // })
    try {
        res.status(201).send(await Post.find())
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
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

// Update a specific post. Only admin or author can update.
// How to sanitise and validate data?
router.put('/:postID', verifyJwtHeader, verifyJwtRole, onlyAllowAdminOrAuthor, async (req, res) => {
    try {
        console.log("Request body: ", req.body)
    
       let postDetails = {
            postID: req.params.postID,
            updatedData: { 
                title: req.body.title,
                content: req.body.content
            }
        }

        res.json(await updatePost(postDetails))
    } catch (error) {
        res.status(500).json({ error: "Failed to update post"})
    }
})

// Delete a specific post
router.delete('/:postID', async (req, res) => {
    res.json(await deletePost(req.params.postID))
})

export default router