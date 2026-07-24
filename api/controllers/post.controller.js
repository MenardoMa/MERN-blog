import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

/**
 * Create post model
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const create = async (req, res, next) => {
    try {
        
        if(!req.user.isAdmin){
            return next(errorHandler(403, "Vous n'etes pas authorisé a creer un post"))
        }

        const { title, content } = req.body

        if(!title || !content){
            return next(errorHandler(403, "Tous les champs sont requis"))
        }

        const slug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-')

        const newPost = new Post({
            ...req.body,
            slug,
            userId: req.user.id
        })

        const savePost = await newPost.save()

        return res.status(201).json(savePost)
        
    } catch (error) {
        return next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}

export const getPosts = async (req, res, next) => {
    try {
        
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order === "asc" ? 1 : -1

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && { 
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            })
        }).sort({
            updatedAt: sortDirection
        })
        .skip(startIndex)
        .limit(limit);

        const totalPosts = await Post.countDocuments()
        const now = new Date()

        const oneMonthAgo  = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        })

    } catch (error) {
        next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}