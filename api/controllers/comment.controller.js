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
        const page = Number(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalComments = await Comment.countDocuments({ postId });

        res.status(200).json({
            comments,
            totalComments,
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit),
            hasMore: page * limit < totalComments,
        });

    } catch (error) {
        next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}

/**
 * Like Comment for Post method
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const likeComment = async (req, res, next) => {
    try {
        
        const { commentId } = req.params
        const comment = await Comment.findById(commentId)

        if(!comment){
            return next(errorHandler(400, "Comment introuvable"))
        }

        const userId = req.user.id;
        const userIndex = comment.likes.indexOf(userId)

        if(userIndex === -1){
            comment.numberOfLikes += 1
            comment.likes.push(userId)
        }else{
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)
        }

        await comment.save()
        res.status(200).json(comment)

    } catch (error) {
        next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}

/**
 * Edit Comment method
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const editComment = async (req, res, next) => {
    try {
        
        const { commentId } = req.params
        const comment = await Comment.findById(commentId)

        if(!comment){
            return next(errorHandler(404, "Comment introuvable"))
        }

        if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, "Vous ne pouvez pas modifier ce commentaire"));
        }

        const editedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                content: req.body.content
            },
            {
                new: true
            }
        )

        res.status(200).json(editedComment)

    } catch (error) {
        next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}

/**
 * Get All Comments
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const getComments = async (req, res, next) => {
    
    if(!req.user.isAdmin){
        return next(errorHandler(403, "Vous n'etes pas autorisé"))
    }
    
    try {
        
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1

        const comments = await Comment.find()
              .sort({ createdAt: sortDirection })
              .skip(startIndex)
              .limit(limit)

        const totalComments = await Comment.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthComments = await Comment.countDocuments({ 
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json(
            {
                comments,
                totalComments,
                lastMonthComments
            }
        )

    } catch (error) {
        next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}

/**
 * Delete Comment method
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const deleteComment = async (req, res, next) => {
    try {
        
        const { commentId } = req.params 
        const comment = await Comment.findById(commentId)

        if(!comment){
            return next(errorHandler(404, "Comment introuvable"))
        }

        if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, "Vous ne pouvez pas modifier ce commentaire"));
        }

        await Comment.findByIdAndDelete(commentId)
        res.status(200).json("Commentaire supprimé")

    } catch (error) {
        next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}