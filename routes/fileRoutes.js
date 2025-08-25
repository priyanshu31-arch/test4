import express from 'express';
import multer from 'multer';
import { uploadFile, downloadFile } from '../controllers/fileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/download/:id', downloadFile);

export default router;