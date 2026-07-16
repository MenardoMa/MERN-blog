import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"

dotenv.config()

// mongoose.
//         connect(process.env.MONGO)
//         .then(() => console.log('MongoDB is connected'))
//         .catch((err) => {
//             console.error(err)
//         })

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())



/**
 * 
 * Routes
 * 
 */

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

/**
 * 
 * Middleware
 * 
 */
app.use((err, req, res, next) => {
    
    const statusCode = err.statusCode || 500
    const message = err.message || 'Une Erreur server est survenue.'

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message 
    })
})

/**
 * 
 * Server
 * 
 */

app.listen(PORT, () => {
    console.log('Server demarrer au port http://localhost:'+ PORT)
})