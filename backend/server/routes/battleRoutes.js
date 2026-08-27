import express from "express";
import {
  createBattle,
  getBattle,
  joinBattle,
  startBattle,
  leaveBattle,
  getLeaderboard,
} from "../controllers/battleController.js";

const router = express.Router();

router.post("/create", createBattle);
router.get("/:battleId", getBattle);
router.post("/:battleId/join", joinBattle);
router.post("/join", joinBattle);
router.post("/:battleId/leave", leaveBattle);
router.post("/:battleId/start", startBattle);
router.get("/:battleId/leaderboard", getLeaderboard);

export default router;