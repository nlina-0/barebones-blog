import { Role } from "../models/RoleModels.js"
import { User } from "../models/UserModels.js"

// Returns all documents in a collection
async function getAllRoles() {
    return await Role.find({})
}

// Return user with specified role
async function getUserWithRole(roleName) {

    // Get the role ID for the role specified
    let roleID = await Role.findOne({name: roleName}).exec()

    // Filter through the Users to find only the ones with the matching role ID
    let usersFound = await User.find({role: roleID}).exec()

    return usersFound
}

export { getAllRoles, getUserWithRole }