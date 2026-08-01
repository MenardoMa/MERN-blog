import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';

export const createComment = async (req, res, next) => {
    try {

        const { content, postId, userId } = req.body

        if(userId != req.user.id){
            return next(errorHandler(403, "Vous n'êtes pas autorisé à créer un commentaire."));
        }

        if (!content || !postId) {
            return next(errorHandler(400, "Tous les champs sont requis."));
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        });

        await newComment.save()
        return res.status(200).json(newComment)
        
    } catch (error) {
        next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}