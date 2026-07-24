import Router from "express"
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { create, getPosts } from "../controllers/post.controller.js";

const router = Router()

router.post('/create', verifyToken, create)
router.get('/getPosts', getPosts)

export default router