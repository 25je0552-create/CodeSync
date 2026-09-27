import express from "express";
import {
  getProblem,
  searchProblems,
} from "../controllers/problemController.js";

const router = express.Router();

router.get("/search", searchProblems);
router.get("/:problemId", getProblem);

export default router;
