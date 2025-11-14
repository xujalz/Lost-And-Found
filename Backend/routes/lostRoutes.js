import express from "express";
import {
  createLost,
  getLost,
  getLostById,
  deleteLost,
  updateLost,  
  myLost,
} from "../controllers/lostController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getLost);
router.get("/mine", protect, myLost);
router.get("/:id", getLostById);
router.post("/", protect, upload.single("image"), createLost);
router.delete("/:id", protect, deleteLost);
router.put("/:id", protect, upload.single("image"), updateLost);  // lost

export default router;
