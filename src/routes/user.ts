import { Router } from 'express';
import UserController from "../controller/UserController";


const router = Router();

router.get('/', UserController.getAll)
router.post('/', UserController.addOne)


export default router;