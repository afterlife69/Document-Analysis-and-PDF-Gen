import { getQuestionLeaderboard } from "../controllers/getQPRanks.js";
import { userAuthMiddleware } from "../middleware/userAuth.js";
import express from "express";

const router = express.Router();

router.get("/", userAuthMiddleware, getQuestionLeaderboard);

export default router;