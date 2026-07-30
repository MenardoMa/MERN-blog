import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
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

        if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, "Vous n'êtes pas autorisé à modifier ce profil."));
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return next(errorHandler(404, "Utilisateur introuvable."));
        }

        const updateData = {};

        // PASSWORD
        if (req.body.password !== undefined) {

            const password = req.body.password.trim();
            if (password.length < 6) {
                return next(errorHandler(400, "Le mot de passe doit contenir au moins 6 caractères."));
            }
            updateData.password = bcryptjs.hashSync(password, 10);
        }

        // USERNAME
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

            updateData.username = username;
        }

        // EMAIL
        if (req.body.email !== undefined) {
            updateData.email = req.body.email;
        }

        // PHOTO
        let oldProfilePictureId = null;

        if (req.body.profilePicture && req.body.profilePictureId) {

            updateData.profilePicture = req.body.profilePicture;
            updateData.profilePictureId = req.body.profilePictureId;

            oldProfilePictureId = user.profilePictureId;
        }

        // Mise à jour MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { 
                $set: updateData 
            },
            { 
                new: true 
            }
        );

        // Suppression de l'ancien avatar APRÈS la mise à jour
        if (oldProfilePictureId && oldProfilePictureId !== req.body.profilePictureId) {
            await cloudinary.uploader.destroy(oldProfilePictureId);
        }

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        return next(errorHandler(500, 'Une erreur interne est survenue. '+ error.message));
    }
};


/**
 * Delete account user method
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const deleteUser = async (req, res, next) => {
    try {

        if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, "Vous ne pouvez pas supprimer ce compte."));
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return next(errorHandler(404, "Utilisateur introuvable."));
        }

        if (user.profilePictureId) {
            await cloudinary.uploader.destroy(user.profilePictureId);
        }

        await User.findByIdAndDelete(req.params.userId);

        res.clearCookie("access_token").status(200).json({
            message: "Compte supprimé avec succès."
        });

    } catch (error) {
        return next(errorHandler(500, "Une erreur interne est survenue. " + error.message));
    }
};


/**
 * Delete User From Admin method
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const deleteUserAdmin = async (req, res, next) => {
    
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "Accès refusé."));
    }
    
    try {
       
        const user = await User.findById(req.params.userId);

        if (!user) {
            return next(errorHandler(404, "Utilisateur introuvable."));
        }

        if (user.profilePictureId) {
            await cloudinary.uploader.destroy(user.profilePictureId);
        }

        await User.findByIdAndDelete(user._id);

        res.status(200).json({
            message: "Utilisateur supprimé avec succès."
        });
        
    } catch (error) {
        return next(errorHandler(500, "Une erreur interne est survenue. " + error.message));
    }
}

/**
 * Get Users method
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const getUsers = async (req, res, next) => {
    
    if(!req.user.isAdmin){
        return next(errorHandler(403, "Vous ne pouvez pas charger les users."));
    }

    try {

        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 10
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const users = await User.find()
                                .sort({ createdAt: sortDirection })
                                .skip(startIndex)
                                .limit(limit)
        
        // On retire tout le password a chaque user 
        const userWithoutPassword = users.map((user) => {
            const {password, ...rest} = user._doc
            return rest 
        })

        const totalUsers = await User.countDocuments()
        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthUser = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            users: userWithoutPassword,
            totalUsers,
            lastMonthUser
        })
         
    } catch (error) {
        return next(errorHandler(500, "Une erreur interne est survenue. " + error.message));
    }
}

/**
 * signout method
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const signout = async (req, res, next) => {
    try {
        res
            .clearCookie("access_token")
            .status(200)
            .json({
            message: "Vous etes deconnecté."
        });
    } catch (error) {
        return next(errorHandler(500, "Une erreur interne est survenue. " + error.message));
    }
}