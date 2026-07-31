import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res, next) => {

    try {

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Image obligatoire"
            });
        }

        const folder = req.body.folder || "general";

        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder:`mern-blog/${folder}`,
                transformation:[
                    {
                        width: 1200,
                        height: 675,
                        crop: "fill",
                        gravity: "auto",
                        quality: "auto",
                        fetch_format: "auto",
                    }
                ]
            }
        );

        res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch(error){
        next(error);
    }
};