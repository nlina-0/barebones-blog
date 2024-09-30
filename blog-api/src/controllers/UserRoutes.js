import express, { Router } from "express"
import { User } from "../models/UserModels.js"
import { 
    encryptString, 
    decryptString, 
    decryptObject, 
    hashString, 
    validateHashedData, 
    generateJWT, 
    generateUserJWT, 
    verifyUserJWT, 
    getAllUsers, 
    getSpecificUser, 
    createUser, 
    updateUser, 
    deleteUser 
} from "./UserFunctions.js"

const router = Router()

// Sign-up a new user
router.post('/sign-up', async (req, res) => {
    let userDetails = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        country: req.body.country,
        roleID: req.body.roleID
    }

    let newUserDoc = await createUser(userDetails)

    res.json({
        user: newUserDoc
    })
})

// Log-in an existing user
router.post('/log-in', async (req, res) => {
    let targetUser = await User.findOne({email: req.body.email}).exec()

    if (await validateHashedData(req.body.password, targetUser.password)) {
        let encryptedUserJwt = await generateUserJWT(
            {
                userID: targetUser.id,
                email: targetUser.email,
                password: targetUser.password
            }
        )

        res.json(encryptedUserJwt)
    } else {
        res.status(400).json({message:"Invalid user details provided."})
    }
})

// Extend a user's JWT validity
router.post('/token-refresh', async(req, res) => {
    let oldToken = req.body.jwt
    let refreshResult = await verifyUserJWT(oldToken).catch(error => {return {error: error.message}})
    res.json(refreshResult)
})

// Update a user
router.put('/:userID', async (req, res) => {
    let userDetails = {
        userID: req.params.userID,
        updatedData: req.body.newUserData
    }

    res.json(await updateUser(userDetails))
})

// Delete a user
router.delete('/:userID', async (req, res) => {
    res.json(await deleteUser(req.params.userID))
})

// List all users
router.get('/', async (req, res) => {
    let allUsers = await getAllUsers()

    res.json({
        userCount: allUsers.length,
        usersArray: allUsers
    })
})

// Show a specific user
router.get('/:userID', async (req, res) => {
    res.json(await getSpecificUser(req.params.userID))
})

export default router