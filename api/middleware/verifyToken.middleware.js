import jwt from "jsonwebtoken"
import { errorHandler } from '../utils/error.js';


export const verifyToken = (req, res, next) => {
    try {
        
        const token = req.cookies.access_token

        if(!token){
            return next(errorHandler(401, 'Access non autorisé'))
        }
  
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

            if(err){
                return next(errorHandler(401, 'Access non autorisé'))
            }
            req.user = user 
            next()
        });

    } catch (error) {
        return next(errorHandler(500, 'Une erreur interne est survenue. '+ error.message))
    }
}