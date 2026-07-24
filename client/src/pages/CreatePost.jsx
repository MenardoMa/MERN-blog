import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const CreatePost = () => {

  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const handlerUploadImage = async () => {

    if(!file){
        setUploadError("Veuillez sélectionner une image.")
        return 
    }

    try {
        
        setUploading(true)
        setUploadError(null)
        setUploadSuccess(null)

        const formData = new FormData()

        formData.append("image", file)
        formData.append("folder", "posts")  // dossier Cloudinary

        // Sauvegarde au cloudinary
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData
        })

        const data = await res.json()

        setUploading(false);

        if(!res.ok || !data.success){
            setUploadError(data.message);
            return;
        }

        setImageUrl(data.url)
        setImagePublicId(data.public_id)
        setUploadSuccess("Image chargé avec succes")

        console.log(data)

    } catch (error) {
        setUploadError(error.message);
        setUploadSuccess(null)
    }

  }

  return (
    <div className="p-3 max-w-3xl w-full mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
      <form action="" className="flex flex-col gap-4">
            {uploadError && (
                <Alert color="failure">
                    {uploadError}
                </Alert>
            )}
            {uploadSuccess && (
                <Alert color="success">
                    {uploadSuccess}
                </Alert>
            )}
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput 
                    type="text"
                    placeholder="Title"
                    required
                    id="title"
                    className="flex-1"
                />
                <Select>
                    <option value="uncategorizes">Selectionne une categorie</option>
                    <option value="javascript">Javascript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>
            <div 
                className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3"
            >
                <FileInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                    type="button"
                    size="sm"
                    outline
                    className="cursor-pointer"
                    onClick={handlerUploadImage}
                    disabled={uploading}
                >
                    {uploading ? "Chargement..." : "Upload image"}
                </Button>
            </div>
            <ReactQuill 
                theme="snow" 
                placeholder="Contenue"
                className="h-80 mb-12"
                required
            />
            <Button
                type="submit"
                outline
                className="cursor-pointer"
            >
                Publier
            </Button>
      </form>
    </div>
  )
}

export default CreatePost
