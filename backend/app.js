// src/app.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import getDocumentsRoute from './routes/documentsRoutes.js'
import leaderboardRoute from './routes/leaderboardRoutes.js';
// import uploadPersonalRoutes from './routes/uploadPersonalRoutes.js';
dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', getDocumentsRoute);
app.use('/api/pdf', pdfRoutes);
app.use('/api/leaderboard', leaderboardRoute);
// app.use('/api/upload-personal', uploadPersonalRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
