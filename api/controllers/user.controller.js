import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({ message: 'API is working'})
}

/**
 * Update user info Method
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const updateUser = async (req, res, next) => {
    try {
        
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403, 'Vous n\'etes pas autorisiré a modifier ce profile'))
        }

        if (req.body.password !== undefined) {
            const password = req.body.password.trim();
            if (password.length < 6) {
                return next(
                    errorHandler(400, "Le mot de passe doit contenir au moins 6 caractères.")
                );
            }
            req.body.password = bcryptjs.hashSync(password, 10);
        }

        if (req.body.username !== undefined) {

            const username = req.body.username.trim();

            if (username.length === 0) {
                return next(errorHandler(400, "Le username est obligatoire."));
            }

            if (username.length < 3 || username.length > 20) {
                return next(errorHandler(400, "Le username doit contenir entre 3 et 20 caractères."));
            }

            if (username.includes(" ")) {
                return next(errorHandler(400, "Le username ne doit pas contenir d'espaces."));
            }

            if (username !== username.toLowerCase()) {
                return next(errorHandler(400, "Le username doit être en minuscules."));
            }

            if (!/^[a-z0-9]+$/.test(username)) {
                return next(errorHandler(400, "Le username ne peut contenir que des lettres minuscules et des chiffres."));
            }

            req.body.username = username;
        }

        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        },{ new: true });

        const { password, ...rest } = updateUser._doc 

        res.status(200).json( rest )


    } catch (error) {
        return next(errorHandler(500, 'Une erreur interne est survenue. '+ error.message))
    }
}