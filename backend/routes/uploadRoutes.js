// src/routes/uploadRoutes.js
import express from 'express';
import { userAuthMiddleware } from '../middleware/userAuth.js';
import { uploadMiddleware, uploadDocuments } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', userAuthMiddleware, uploadMiddleware, uploadDocuments);

export default router;
