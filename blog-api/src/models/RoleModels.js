import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    name: String,
    description: String
})

const Role = mongoose.model("Role", RoleSchema)

export { Role }