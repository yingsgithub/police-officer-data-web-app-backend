import { Router } from 'express';
import multer from 'multer';
import FileController from "../controller/FileController";


const router = Router();
const upload = multer({dest: 'uploads/'});
router.post('/upload', upload.single('file'), FileController.uploadCSV)


export default router;