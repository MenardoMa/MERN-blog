import Router from "express"
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { create } from "../controllers/post.controller.js";

const router = Router()

router.post('/create', verifyToken, create)

export default router