import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

/**
 * 
 * Create Comment
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const createComment = async (req, res, next) => {
    try {

        const { content, postId, userId } = req.body

        if(userId != req.user.id){
            return next(errorHandler(403, "Vous n'êtes pas autorisé à créer un commentaire."));
        }

        if (!content || !postId) {
            return next(errorHandler(400, "Veuillez saisir votre commentaire."));
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

/**
 * Get Comment for Post
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getPostComment = async (req, res, next) => {
    try {
        
        const { postId } = req.params;
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
        res.status(201).json(comment)

    } catch (error) {
        next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}