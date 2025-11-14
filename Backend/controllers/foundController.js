import FoundItem from "../models/FoundItem.js";

// Create Found Item
export const createFound = async (req, res) => {
  try {
    const { name, description, place, dateTime, contact, category } = req.body;

    if (!name || !place || !dateTime || !contact)
      return res.status(400).json({ message: "Required fields missing" });

    const imagePath = req.file ? req.file.path : "";  // Cloudinary URL

    const item = await FoundItem.create({
      name,
      description,
      place,
      dateTime,
      contact,
      category,
      imagePath,
      user: req.user._id,
      founderName: req.user.name,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all found items
export const getFound = async (req, res) => {
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

  const items = await FoundItem.find(q).sort({ createdAt: -1 });
  res.json(items);
};

// Get found item by id
export const getFoundById = async (req, res) => {
  const item = await FoundItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
};

// Delete found item
export const deleteFound = async (req, res) => {
  const item = await FoundItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  if (String(item.user) !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  await item.deleteOne();
  res.json({ message: "Deleted successfully" });
};

// Update found item
export const updateFound = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
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


// Get user's found items
export const myFound = async (req, res) => {
  const items = await FoundItem.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
};


// import path from "path";
// import FoundItem from "../models/FoundItem.js";

// const publicPath = (filePath) => "/uploads/" + path.basename(filePath);

// // Create Found Item
// export const createFound = async (req, res) => {
//   try {
//     const { name, description, place, dateTime, contact, category } = req.body;
//     if (!name || !place || !dateTime || !contact)
//       return res.status(400).json({ message: "Required fields missing" });

//     const imagePath = req.file ? publicPath(req.file.path) : "";

//     const item = await FoundItem.create({
//       name,
//       description,
//       place,
//       dateTime,
//       contact,
//       category,
//       imagePath,
//       user: req.user._id,
//       founderName: req.user.name,
//     });

//     res.status(201).json(item);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get all found items
// export const getFound = async (req, res) => {
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
//   const items = await FoundItem.find(q).sort({ createdAt: -1 });
//   res.json(items);
// };

// // Get found item by id
// export const getFoundById = async (req, res) => {
//   const item = await FoundItem.findById(req.params.id);
//   if (!item) return res.status(404).json({ message: "Not found" });
//   res.json(item);
// };

// // Delete found item
// export const deleteFound = async (req, res) => {
//   const item = await FoundItem.findById(req.params.id);
//   if (!item) return res.status(404).json({ message: "Not found" });
//   if (String(item.user) !== req.user.id)
//     return res.status(403).json({ message: "Unauthorized" });
//   await item.deleteOne();
//   res.json({ message: "Deleted successfully" });
// };

// // Get user's found items
// export const myFound = async (req, res) => {
//   const items = await FoundItem.find({ user: req.user.id }).sort({ createdAt: -1 });
//   res.json(items);
// };
