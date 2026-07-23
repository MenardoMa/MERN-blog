import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    try {
        
        
    } catch (error) {
        return next(errorHandler(500, "Une erreur interne est survenue. " + error.message))
    }
}