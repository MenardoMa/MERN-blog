import mongoose, { Schema } from "mongoose"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: "https://media.istockphoto.com/id/1451587807/fr/vectoriel/vecteur-dic%C3%B4ne-de-profil-utilisateur-avatar-ou-ic%C3%B4ne-de-personne-photo-de-profil-symbole.jpg?s=612x612&w=0&k=20&c=hWdVW8_-dFwDctfVF0VXDH6TEnkMX9x6NkQhwWo2zTc="
        },
        profilePictureId: {
            type: String,
            default: null
        },
        isAdmin: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

export default User