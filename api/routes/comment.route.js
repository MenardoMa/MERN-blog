import Router from "express"
import { 
    createComment, 
    getPostComment 
} from "../controllers/comment.controller.js";
import { verifyToken } from './../middleware/verifyToken.middleware.js';

const router = Router()

router.post('/create', verifyToken ,createComment)
router.get('/getPostComments/:postId', getPostComment)

export default router