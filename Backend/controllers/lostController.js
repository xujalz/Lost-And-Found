import LostItem from "../models/LostItem.js";

// Create Lost Item
export const createLost = async (req, res) => {
  try {
    const { name, description, place, dateTime, contact, category } = req.body;

    if (!name || !place || !dateTime || !contact)
      return res.status(400).json({ message: "Required fields missing" });

    const imagePath = req.file ? req.file.path : ""; // Cloudinary URL

    const item = await LostItem.create({
      name,
      description,
      place,
      dateTime,
      contact,
      category,
      imagePath,
      user: req.user._id,
      victimName: req.user.name,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all lost items
export const getLost = async (req, res) => {
  const { search } = req.query;
  const q = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { place: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const items = await LostItem.find(q).sort({ createdAt: -1 });
  res.json(items);
};

// Get lost item by id
export const getLostById = async (req, res) => {
  const item = await LostItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
};

// Delete lost item
export const deleteLost = async (req, res) => {
  const item = await LostItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  if (String(item.user) !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  await item.deleteOne();
  res.json({ message: "Deleted successfully" });
};

// Update lost item
export const updateLost = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (String(item.user) !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const imagePath = req.file ? req.file.path : item.imagePath;

    item.name = req.body.name;
    item.description = req.body.description;
    item.place = req.body.place;
    item.dateTime = req.body.dateTime;
    item.contact = req.body.contact;
    item.category = req.body.category;
    item.imagePath = imagePath;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};


// Get user's own lost items
export const myLost = async (req, res) => {
  const items = await LostItem.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
};


// import path from "path";
// import LostItem from "../models/LostItem.js";

// const publicPath = (filePath) => "/uploads/" + path.basename(filePath);

// // Create Lost Item
// export const createLost = async (req, res) => {
//   try {
//     const { name, description, place, dateTime, contact, category } = req.body;
//     if (!name || !place || !dateTime || !contact)
//       return res.status(400).json({ message: "Required fields missing" });

//     const imagePath = req.file ? publicPath(req.file.path) : "";

//     const item = await LostItem.create({
//       name,
//       description,
//       place,
//       dateTime,
//       contact,
//       category,
//       imagePath,
//       user: req.user._id,
//       victimName: req.user.name,
//     });

//     res.status(201).json(item);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get all lost items
// export const getLost = async (req, res) => {
//   const { search } = req.query;
//   const q = search
//     ? {
//         $or: [
//           { name: { $regex: search, $options: "i" } },
//           { place: { $regex: search, $options: "i" } },
//           { category: { $regex: search, $options: "i" } },
//         ],
//       }
//     : {};
//   const items = await LostItem.find(q).sort({ createdAt: -1 });
//   res.json(items);
// };

// // Get lost item by id
// export const getLostById = async (req, res) => {
//   const item = await LostItem.findById(req.params.id);
//   if (!item) return res.status(404).json({ message: "Not found" });
//   res.json(item);
// };

// // Delete lost item
// export const deleteLost = async (req, res) => {
//   const item = await LostItem.findById(req.params.id);
//   if (!item) return res.status(404).json({ message: "Not found" });
//   if (String(item.user) !== req.user.id)
//     return res.status(403).json({ message: "Unauthorized" });
//   await item.deleteOne();
//   res.json({ message: "Deleted successfully" });
// };

// // Get user's own lost items
// export const myLost = async (req, res) => {
//   const items = await LostItem.find({ user: req.user.id }).sort({ createdAt: -1 });
//   res.json(items);
// };
