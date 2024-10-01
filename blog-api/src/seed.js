import mongoose from "mongoose";
import { dbConnect } from "./database.js";
import { Role } from "./models/RoleModels.js"
import { User } from "./models/UserModels.js"
import { Post } from "./models/PostModels.js";
import dotenv from "dotenv"
import { hashString } from "./controllers/UserFunctions.js"

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
    {
        username: "seedUser1",
        email:"seed1@email.com",
        password: null,
        country:"Australia",
        role: null
    },
    {
        username: "seedUser2",
        email:"seed2@email.com",
        password: null,
        country:"TheBestOne",
        role: null
    },
    {
        username: "userOne",
        email: "user_test@mail.com",
        password: null,
        country: "australia",
        role: null
    }
]


// TODO: fill in after creating users successfully.
const posts = [
    {
        title: "Some seeded post",
        description: "Very cool. Best post. Huge post. No other posts like it!",
        author: null
    },
    {
        title: "Some other seeded post",
        description: "Very cool. Best post. Huge post. One other post like it!",
        author: null
    },
    {
        title: "Another seeded post",
        description: "Very cool. Best post. Huge post. Two other posts like it!",
        author: null
    }
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
    if (process.env.WIPE == "true") {
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
    // Store the new documents as a variable for use later
    let rolesCreated = await Role.insertMany(roles)
    console.log(rolesCreated)

    // Iterate through the users array, using for-of to enable async/await 
    for (const user of users) {
        // Set password of the user
        user.password = await hashString("password")
        // Randomise role from the roles created and set to user
        user.role = rolesCreated[Math.floor(Math.random() * rolesCreated.length)].id
    }
    // Save the users to the db
    let usersCreated = await User.insertMany(users)

    // Same for posts
    // pick a random user and assign that user as the author of a post.
    for (const post of posts) {
        post.author = usersCreated[Math.floor(Math.random() * usersCreated.length)].id
    }
    
    // Then save the posts to the database.
    let postsCreated = await Post.insertMany(posts)

    // Log modified to list all data created.
    console.log("New DB data created.\n" + JSON.stringify({roles: rolesCreated, users: usersCreated, posts: postsCreated}, null, 4))
}).then(() => {
    // Disconnect from the database
    mongoose.disconnect()
    console.log("DB seed connection closed.")
})