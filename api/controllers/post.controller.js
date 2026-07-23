import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    try {
        
        if(!req.user.isAsmin){
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