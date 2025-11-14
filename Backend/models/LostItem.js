import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    victimName: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    place: String,
    dateTime: String,
    contact: String,
    category: String,
    imagePath: String,
  },
  { timestamps: true }
);

const LostItem = mongoose.model("LostItem", lostItemSchema);
export default LostItem;
