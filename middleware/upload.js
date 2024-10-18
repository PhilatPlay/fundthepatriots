const multer = require('multer');
const path = require('path');


// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit allowable for quality; candidates and pics will be limited and managed.
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {

        // Check file size
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return cb(new Error('File size exceeds 5MB. Please resize your image.'));
        }
        return cb(null, true);
    } else {
        cb(new Error('Images Only!'));
    }
}

module.exports = upload.single('picture'); // Ensure single file upload is exported

