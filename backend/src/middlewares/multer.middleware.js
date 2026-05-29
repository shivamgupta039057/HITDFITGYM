// const { log } = require("console");
// const multer = require("multer");
// const path = require("path");
// // require()
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
        
//         cb(null,path.join(__dirname,'../../public/uploads'));
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// const upload = multer({
//     storage,
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directory path
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });  // Create directory if it doesn't exist
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR); // Define where to save the file
  },
  filename: (req, file, cb) => {
    // Use a timestamp to ensure unique file names
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Optional: File filter to allow only certain file types (e.g., images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;  // Only allow images and PDF
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);  // Accept the file
  } else {
    cb(new Error("Only images and PDF files are allowed!"), false);  // Reject the file
  }
};

// Set up multer with storage, file filter, and limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10 MB limit for file size
  },
});

module.exports = upload;
