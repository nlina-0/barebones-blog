import express, { request, response } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import { dbConnect, dbDisconnect } from "./database.js"

dotenv.config()

const app = express()
const HOST = process.env.HOST || "localhost"
const PORT = process.env.PORT || 3000

// What is helmet?
app.use(helmet())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.referrerPolicy())
app.use(helmet.contentSecurityPolicy({
    directive: {
        defaultSrc: ["'self'"]
    }
}))

// CORS
var corsOptions = {
    origin: ["http://localhost:5000"],
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

// API-friendly request data formatting
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Connecting to MongoDB
var dbURL = ""
switch (process.env.NODE_ENV) {
    case "test":
        dbURL = "mongodb://localhost:27017//ExpressBuildAnAPI-test"
        break
    case "development":
        dbURL = "mongodb://localhost:27017//ExpressBuildAnAPI-dev"
        break
    case "production":
        dbURL = process.env.DATABASE_URL
        break
    default:
        console.error("Incorrect JS environment specified, database will not be connected.")
        break
}

dbConnect(dbURL)
    .then(() => {
        console.log("Databse connected successfully!")
    })
    .catch(error => {
        console.log(`
        Some error ocurred connecting to the database! It was:
        ${error}
        `)
    })
        

// Home route
app.get('/', (req, res) => {
    res.json({
        message: "Hello world!"
    })
})

// When no valid route is found, 404 handler route
app.get('*', (req, res) => {
    res.status(404).json({
        message: "No route with that path found!",
        attemptedPath: req.path
    })
})


export { HOST, PORT, app }