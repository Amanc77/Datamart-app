import express from "express";
import {
  getRealEstate,
  getStartupFunding,
} from "../controllers/dataset.controller.js";

const router = express.Router();

router.get("/estate", getRealEstate);
router.get("/fundedstartup", getStartupFunding);

export default router;
