import { app, HOST, PORT } from "./server.js"

app.listen(PORT, HOST, () => {
    console.log(`
        ExpressJS blog API is now running!
        
        Congrats!
        `)
})