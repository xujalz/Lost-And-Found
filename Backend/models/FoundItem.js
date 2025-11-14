import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    founderName: { type: String, required: true },
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

const FoundItem = mongoose.model("FoundItem", foundItemSchema);
export default FoundItem;
