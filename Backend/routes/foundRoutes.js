import express from "express";
import {
  createFound,
  getFound,
  getFoundById,
  deleteFound,
  updateFound,
  myFound,
} from "../controllers/foundController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getFound);
router.get("/mine", protect, myFound);
router.get("/:id", getFoundById);
router.post("/", protect, upload.single("image"), createFound);
router.delete("/:id", protect, deleteFound);
router.put("/:id", protect, upload.single("image"), updateFound); // found

export default router;
