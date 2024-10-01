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
import jwt from "jsonwebtoken"
import { Role } from "../models/RoleModels.js"

const router = Router()

// --------------------------------------
// ----- Middleware

// Make sure the JWT available in the headers is valid,
// and refresh it to keep the JWT usable for longer.
const verifyJwtHeader = async (req, res, next) => {
    let rawJwtHeader = req.headers.jwt
    let jwtRefresh = await verifyUserJWT(rawJwtHeader)
    req.headers.jwt = jwtRefresh

    // A function that is used to pass control to the next middleware function in the req-res cycle.
    next()
}

const verifyJwtRole = async (request, response, next) => {
    // Verify that the JWT is still valid.
    let userJwtVerified = jwt.verify(request.headers.jwt,process.env.JWT_SECRET, {complete: true});
    // Decrypt the encrypted payload.
    let decryptedJwtPayload = decryptString(userJwtVerified.payload.data);
    // Parse the decrypted data into an object.
    let userData = JSON.parse(decryptedJwtPayload);
    // Because the JWT doesn't include role info, we must find the full user document first:
    let userDoc = await User.findById(userData.userID).exec();
    let userRoleName = await Role.findById(userDoc.role).exec();
    // Attach the role to the request for the backend to use.
    // Note that the user's role will never be available on the front-end
    // with this technique.
    // This means they can't just manipulate the JWT to access admin stuff.
    console.log("User role is: " + userRoleName.name);
    request.headers.userRole = userRoleName.name;
    next();
}

// Validate user email uniqueness
const uniqueEmailCheck = async (req, res, next) => {
    let isEmailInUse = await User.exists({email: req.body.email}).exec()
    if (isEmailInUse) {
        next(new Error("An account with this email address already exists."))
    } else {
        next()
    }
}

// If any errors are detected, end the route early
// and respond with the error message
const handleErrors = async (error, req, res, next) => {
    if (error) {
        res.status(500).json({
            error: error.message
        })
    } else {
        next()
    }
}

// Sign-up a new user
router.post('/sign-up', uniqueEmailCheck, handleErrors, async (req, res) => {
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
// TODO: Not working, user not updating
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