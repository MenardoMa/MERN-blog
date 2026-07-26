import { Alert, Button, FileInput, Select, TextInput, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from 'react-router-dom';

const UpdateCreatePost = () => {

    const categories = [
        "javascript",
        "reactjs",
        "nextjs",
    ];

  const [file, setFile] = useState(null)

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [postError, setPostError] = useState(null)
  
  const [postSuccess, setPostSuccess] = useState(null)
  const [postFormData, setPostFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
    image_id: ""
  })
  const [postLoading, setPostLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false)

  const navigation = useNavigate()
  const { postId } = useParams()

  /**
   * 
   * Fetch Post 
   * 
   */
useEffect(() => {
    const fetchPost = async () => {
        
        setLoadingPage(true)

        try {
            const res = await fetch(`/api/post/getPosts?postId=${postId}`);
            const data = await res.json();

            if (!res.ok) {
                setPostError(data.message);
                return;
            }

            setPostFormData(data.posts[0]);

        } catch (error) {
            setPostError(error.message);
        } finally {
            setLoadingPost(false);
            setLoadingPage(false)
        }
    };

    if(postId){
        fetchPost();
    }

}, [postId]);

  /**
   * Upload Image
   * 
   * @returns 
   */
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

        setUploadSuccess("Image chargé avec succes")
        setPostFormData((prev) => ({
            ...prev,
            image: data.url,
            image_id: data.public_id,
        }));

    } catch (error) {
        setUploadError(error.message);
        setUploadSuccess(null)
    }

  }

  /**
   * Submit Post
   * 
   * @param {*} e 
   * @returns 
   */
  const handlerSubmit = async (e) => {
    
    e.preventDefault()
    setPostError(null)
    setPostSuccess(null)
    setPostLoading(true)
    
    if (Object.keys(postFormData).length === 0) {
        setPostError("Vous devez redigerer un post")
        setPostLoading(false)
        return;
    }

    try {
    
        const res = await fetch("/api/post/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postFormData)
        })

        const data = await res.json()

        if(!res.ok){
           setPostError(data.message) 
           setPostSuccess(null)
           return
        }
 
        if(res.ok){
           setPostError(null) 
           setPostSuccess("Post creer avec success")
           navigation(`/post/${data.slug}`)
        }

        setPostLoading(false)
        
    } catch (error) {
        setPostError(error.message)
        setPostSuccess(null)
    } finally{
        setPostLoading(false)
    }   


  }


  return (
    <>
    {
        loadingPage ? (
          <div className="flex justify-center mx-auto items-center py-10">
            <Spinner size="xl" />
          </div>
        ) :
        (
        <div className="p-3 max-w-3xl w-full mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
        <form action="" className="flex flex-col gap-4" onSubmit={handlerSubmit}>
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
            {postError && (
                <Alert color="failure">
                    {postError}
                </Alert>
            )}
            {postSuccess && (
                <Alert color="success">
                    {postSuccess}
                </Alert>
            )}
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput 
                    type="text"
                    placeholder="Title"
                    required
                    id="title"
                    className="flex-1"
                    onChange={(e) =>
                        setPostFormData((prev) => ({
                            ...prev,
                            title: e.target.value.trim(), 
                        }))
                    }
                    value={postFormData.title || ""}
                />
                <Select
                    onChange={(e) =>
                        setPostFormData((prev) => ({
                            ...prev,
                            category: e.target.value, 
                        }))
                    }
                    value={postFormData.category || ""}
                >
                     <option value="">Sélectionnez une catégorie</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
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
            {
                postFormData.image && 
                <>
                    <div className="w-full overflow-hidden h-[500px] border border-zinc-300">
                        <img 
                            src={postFormData.image} 
                            alt={postFormData.title}
                            className="object-cover h-full w-full"
                        />
                    </div>
                </>
            }
            <ReactQuill 
                theme="snow" 
                placeholder="Contenue"
                className="h-80 mb-12"
                required
                onChange={(value) =>
                    setPostFormData((prev) => ({
                        ...prev,
                        content: value, 
                    }))
                }
                value={loadingPost ? "" : postFormData.content || ""}
            />
            <Button
                type="submit"
                outline
                className="cursor-pointer"
                disabled={uploading || postLoading}
            >
                {
                    postLoading ? "Modification ..." : "Modifier"
                }
            </Button>
      </form>
        </div>
        )
    }
    </>
  )
}

export default UpdateCreatePost
