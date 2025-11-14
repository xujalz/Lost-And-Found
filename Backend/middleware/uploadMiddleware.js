import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lost-and-found-items",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });
export default upload;



// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) cb(null, true);
//   else cb(new Error("Only image files allowed"), false);
// };

// const upload = multer({ storage, fileFilter });
// export default upload;
