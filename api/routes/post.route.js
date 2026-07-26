import Router from "express"
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { 
    create, 
    getPosts, 
    deletePost, 
    updatePost
} from "../controllers/post.controller.js";

const router = Router()

router.post('/create', verifyToken, create)
router.get('/getPosts', getPosts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletePost)
router.put('/updatePost/:postId/:userId', verifyToken, updatePost)

export default router