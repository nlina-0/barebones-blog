import express, { application, request, response } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import { dbConnect, dbDisconnect } from "./database.js"
import rolesRoutes from "./controllers/RoleRoutes.js"

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

dbConnect(DB_URI)
    .then(() => {
        console.log("Database connected successfully!")
    })
    .catch(error => {
        console.log(`
        Some error ocurred connecting to the database! It was:
        ${error}
        `)
    })
        
app.get('/databaseHealth', (req,res) => {
    let databaseState = mongoose.connection.readyState;
    let databaseName = mongoose.connection.name;
    let databaseModels = mongoose.modelNames();
    let databaseHost = mongoose.connection.host;

    res.json({
        readyState: databaseState,
        dbName: databaseName,
        dbModels: databaseModels,
        dbHost: databaseHost
    })
})

// Database dump to view see all data
app.get('/databaseDump', async (req, res) => {
    const dumpContainer = {}

    // Get the names of all collections in DB
    var collections = await mongoose.connection.db.listCollections().toArray()
    collections = collections.map((collection) => collection.name)

    // For each collection, get all their data and add it to the dumpContainer
    for (const collectionName of collections) {
        let collectionData = await mongoose.connection.db.collection(collectionName).find({}).toArray()
        dumpContainer[collectionName] = collectionData
    }

    console.log("Dumping all of this data to the client: \n" + JSON.stringify(dumpContainer, null, 4))

    res.json({
        data: dumpContainer
    })
})

// Home route
app.get('/', (req, res) => {
    res.json({
        message: "Hello world!"
    })
})

app.use('/roles', rolesRoutes)

// When no valid route is found, 404 handler route
app.get('*', (req, res) => {
    res.status(404).json({
        message: "No route with that path found!",
        attemptedPath: req.path
    })
})


export { HOST, PORT, app }