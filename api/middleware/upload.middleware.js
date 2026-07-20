import multer from "multer";

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb( new Error("Format non supporté. Utilisez JPG, PNG ou WEBP."), false );
    }
};

const upload = multer({

    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB maximum
    },
    fileFilter
});


export default upload;