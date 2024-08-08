import { Router } from 'express';
import multer from 'multer';
import FilterController from "../controller/FilterController";


const router = Router();
router.get('/officers', FilterController.peaceOfficerFilter)
router.get('/all-by-state', FilterController.stateFilter00)
router.get('/', FilterController.stateFilter)


export default router;