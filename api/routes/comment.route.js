import Router from "express"
import { createComment } from "../controllers/comment.controller.js";
import { verifyToken } from './../middleware/verifyToken.middleware.js';

const router = Router()

router.post('/create', verifyToken ,createComment)

export default router