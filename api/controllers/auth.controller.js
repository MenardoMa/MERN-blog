import User from '../models/user.model.js';
import bcryptjs from "bcryptjs"

export const signup = async (req, res) => {
    
    try {
        
        const { username, email, password } = req.body

        if(!username || !email || !password ||
            username === '' || email === '' || password === ''
        ){
            return res.status(400).json({
                message: 'Tous les champs doivent etre remplis'
            })
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save()

        return res.status(200).json("Enregistrement recu avec succes")

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Une erreur interne est survenue...',
            error: error.message
        })
    }

}