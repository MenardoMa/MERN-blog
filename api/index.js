import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"

dotenv.config()

// mongoose.
//         connect(process.env.MONGO)
//         .then(() => console.log('MongoDB is connected'))
//         .catch((err) => {
//             console.error(err)
//         })

const app = express()
const PORT = process.env.PORT || 3000

/**
 * 
 * Routes
 * 
 */

app.use('/api/user', userRouter)

/**
 * 
 * Server
 * 
 */

app.listen(PORT, () => {
    console.log('Server demarrer au port http://localhost:'+ PORT)
})