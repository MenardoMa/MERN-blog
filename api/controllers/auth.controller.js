import User from '../models/user.model.js';
import bcryptjs from "bcryptjs"
import { errorHandler } from '../utils/error.js';

/**
 * 
 * Sign Up method
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const signup = async (req, res, next) => {
     
    const { username, email, password } = req.body

    if(!username || !email || !password ||
        username === '' || email === '' || password === ''
    ){
        next(errorHandler(400, 'Tous les champs doivent etre remplis'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    try {

        await newUser.save()
        return res.status(200).json("Enregistrement recu avec succes")

    } catch (error) {
        next(error)
    }
}