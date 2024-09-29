import { Router } from "express"
import { getUserWithRole, getAllRoles } from "./RoleFunctions.js"

const router = Router()

// Show all roles
router.get('/', async (req, res) => {
    let resData = {}

    resData = await getAllRoles()

    res.json({
        data: resData
    })
})

// Show all users with matching role
router.get('/:roleName', async (req, res) => {
    let resData = {}

    resData = await getUserWithRole(req.params.roleName)

    res.json({
        data: resData
    })
})

export default router