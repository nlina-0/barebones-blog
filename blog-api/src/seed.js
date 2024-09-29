import mongoose from "mongoose";
import { dbConnect } from "./database.js";
import { Role } from "./models/RoleModels.js"
import { User } from "./models/UserModels.js"
import { Post } from "./models/PostModels.js";
import dotenv from "dotenv"

// Why does it need to read dotenv?
dotenv.config()

const roles = [
    {
        name: "regular",
        description:"A regular user can view, create and read data. They can edit and delete only their own data."
    },
    {
        name: "admin",
        description:"An admin user has full access and permissions to do anything and everything within this API."
    },
    {
        name:"banned",
        description:"A banned user can read data, but cannot do anything else."
    }
]

// TODO: fill in after creating user data encryption functionality.
const users = [

]

// TODO: fill in after creating users successfully.
const posts = [

]

// Connect to database
var DB_URI = ""
switch (process.env.NODE_ENV) {
    case "test":
        DB_URI = "mongodb://localhost:27017/BareBonesBlog-test"
        break
    case "development":
        DB_URI = "mongodb://localhost:27017/BareBonesBlog-dev"
        break
    case "production":
        DB_URI = process.env.DB_URI
        break
    default:
        console.error("Incorrect JS environment specified, database will not be connected.")
        break
}

dbConnect(DB_URI).then(() => {
    console.log("Database connected successfully!")
}).catch(error => {
    console.log(`
        Some error occurred connecting to the database! It was: 
        ${error}
    `)
}).then(async () => {
    if (process.env.WIPE == "true"){
        // Get the names of all collections in the DB
        const collections = await mongoose.connection.db.listCollections().toArray()

        // Empty the data and collections from the DB so that they no longer exist.
        collections.map((collection) => collection.name)
        .forEach(async (collectionName) => {
            mongoose.connection.db.dropCollection(collectionName)
        })
        console.log("Old DB data deleted.")
    }
}).then(async () => {
    // Add new data into the database
    await Role.insertMany(roles)
    console.log("New DB data created.")
}).then(() => {
    // Disconnect from the database
    mongoose.disconnect()
    console.log("DB seed connection closed.")
})