import { Router } from 'express';
import FilterController from "../controller/FilterController";


const router = Router();
router.get('/', FilterController.stateFilter)
router.get('/updated', FilterController.stateFilterUpdated)

export default router;