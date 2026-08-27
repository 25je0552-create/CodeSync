import express from "express";
import { handleExecuteCode } from "./server/controllers/executeController.js";

const router = express.Router();

router.post("/", handleExecuteCode);

export default router;