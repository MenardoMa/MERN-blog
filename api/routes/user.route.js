import Router from "express"
import { 
    test, 
    updateUser, 
    deleteUser, 
    signout, 
    getUsers
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = Router()

router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser) //Modification user endpoint
router.delete('/delete/:userId', verifyToken, deleteUser) //Delete user a compte endpoint
router.get('/getUsers', verifyToken, getUsers)
router.post('/signout', signout) //Logout

export default router