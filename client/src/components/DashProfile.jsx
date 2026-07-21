import { Button, TextInput, Alert } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  
  const { currentUser } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)

  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploadError, setUploadError] = useState(false)

  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const [imageFileUploadSuccess, setImageFileUploadSuccess] = useState(null);

  const filePickerRef = useRef()

  const hanlerImageChange = (e) => {

    const file = e.target.files[0]

    if(file){
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(false);
    }

  }

  useEffect(() => {
    if(imageFile){
      uploadImage()
    }
  }, [imageFile])

  useEffect(() => {
    return () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };
  }, [previewUrl]);

  const uploadImage = async () => {
    
    try {

      setImageFileUploading(true);
      setImageFileUploadError(null);
      setImageFileUploadSuccess(null);
      
      const formData = new FormData();

      formData.append("image", imageFile);
      formData.append("folder", "users/avatar");

      // 1 - Upload vers Cloudinary
      const uploadRes = await fetch("/api/upload",
          {
              method: "POST",
              body: formData
          }
      );

      const uploadData = await uploadRes.json();
      setImageFileUploading(false);

      if(!uploadData.success){
          
          setImageFileUploadError(
              uploadData.message || "Erreur lors de l'upload."
          );
          setPreviewUrl(null);
          return;
      }

       setImageFileUploadSuccess("Image envoyée avec succès.");

        console.log(uploadData);

        // Ici tu pourras ensuite appeler
        // PUT /api/user/update
        // pour enregistrer uploadData.url dans MongoDB

    } catch (error) {
        
        setImageFileUploading(false);
        setImageFileUploadError(
            error.message || "Une erreur est survenue."
        );
        setPreviewUrl(null);

    }

  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
        <form action="" className="flex flex-col gap-4">
          <input type="file" accept="image/*" onChange={hanlerImageChange} ref={filePickerRef} hidden />
          <div className="w-32 h-32 self-center shadow-md overflow-hidden rounded-full cursor-pointer"
            onClick={() => filePickerRef.current.click()}
          >
            <img 
              src={previewUrl || currentUser.profilePicture}
              alt="Avatar user" 
              className="rounded-full cursor-pointer object-cover w-full border-8 border-[lightgray]" 
            />
          </div>
          {
              imageFileUploading && (
                  <Alert color="info">
                      Upload en cours...
                  </Alert>
              )
          }
          {
              imageFileUploadError && (
                  <Alert color="failure">
                      {imageFileUploadError}
                  </Alert>
              )
          }

          {
              imageFileUploadSuccess && (
                  <Alert color="success">
                      {imageFileUploadSuccess}
                  </Alert>
              )
          }
          <TextInput 
            type="text" 
            id="username" 
            placeholder="username" 
            defaultValue={currentUser.username} 
          />
          <TextInput 
            type="email" 
            id="email" 
            placeholder="email" 
            defaultValue={currentUser.email} 
          />
          <TextInput 
            type="password" 
            id="password" 
            placeholder="password" 
          />
          <Button type="submit" className="cursor-pointer">Update</Button>
        </form>
        <div className="mt-5 text-red-500 flex justify-between">
          <span className="cursor-pointer">Delete account</span>
          <span className="cursor-pointer">Sign out</span>
        </div>
    </div>
  )
}

export default DashProfile
