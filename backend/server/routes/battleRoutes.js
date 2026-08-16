import express from "express";

import {

createBattle,

getBattle,

joinBattle,

} from "../controllers/battleController.js";

const router = express.Router();



router.post(
  "/create",
  createBattle
);
router.get("/:battleId", getBattle);

router.post(
  "/join",
  joinBattle
);

export default router;