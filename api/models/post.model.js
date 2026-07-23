import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true 
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: 'https://meduclinic.com/assets/images/blog-default-image.png'
    },
    category: {
        type: String,
        default: "uncategorized",
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

const Post = mongoose.model('Post', postSchema)

export default Post