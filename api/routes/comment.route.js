import Router from "express"
import { 
    createComment, 
    editComment, 
    getPostComment, 
    likeComment
} from "../controllers/comment.controller.js";
import { verifyToken } from './../middleware/verifyToken.middleware.js';

const router = Router()

router.post('/create', verifyToken ,createComment)
router.get('/getPostComments/:postId', getPostComment)
router.put('/likeComment/:commentId', verifyToken, likeComment)
router.put('/editComment/:commentId', verifyToken, editComment)

export default router