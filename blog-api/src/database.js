import mongoose from "mongoose";

async function dbConnect(dbURL) {
    await mongoose.connect(dbURL)
}

async function dbDisconnect() {
    await mongoose.disconnect()
}

export { dbConnect, dbDisconnect }