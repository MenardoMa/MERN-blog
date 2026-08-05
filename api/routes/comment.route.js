import Router from "express"
import { 
    createComment, 
    deleteComment, 
    editComment, 
    getComments, 
    getPostComment, 
    likeComment
} from "../controllers/comment.controller.js";
import { verifyToken } from './../middleware/verifyToken.middleware.js';

const router = Router()

router.post('/create', verifyToken ,createComment)
router.get('/getPostComments/:postId', getPostComment)
router.get('/getComments', verifyToken, getComments)
router.put('/likeComment/:commentId', verifyToken, likeComment)
router.put('/editComment/:commentId', verifyToken, editComment)
router.delete('/deleteComment/:commentId', verifyToken, deleteComment)

export default router