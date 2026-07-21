import Router from "express"
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = Router()

router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser) //modification user endpoint

export default router