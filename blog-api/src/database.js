import mongoose from "mongoose";

async function dbConnect(dbURL) {
    await mongoose.connection(dbURL)
}

async function dbDisconnect() {
    await mongoose.connection.close()
}

export { dbConnect, dbDisconnect }