import { Router } from 'express';
import FilterController from "../controller/FilterController";


const router = Router();
router.get('/', FilterController.stateFilter)

export default router;