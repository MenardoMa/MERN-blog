import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

mongoose.
        connect(process.env.MONGO)
        .then(() => console.log('MongoDB is connected'))
        .catch((err) => {
            console.error(err)
        })

const app = express()

/**
 * 
 * Server
 * 
 */

app.listen(3000, () => {
    console.log('Server demarrer au port 3000 !!!')
})