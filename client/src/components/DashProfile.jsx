import { Button, TextInput, Alert } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { uploadStart, uploadSuccess, uploadFailure } from "../redux/user/userSlice.js"
import { useDispatch } from "react-redux"

const DashProfile = () => {
  
  const { currentUser } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)

  const [previewUrl, setPreviewUrl] = useState(null)

  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const [imageFileUploadSuccess, setImageFileUploadSuccess] = useState(null);

  const [isImageChanged, setIsImageChanged] = useState(false);
  const [userFormData, setFormData] = useState({})

  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)

  const filePickerRef = useRef()
  const dispatch = useDispatch()

  const hanlerImageChange = (e) => {

    const file = e.target.files[0]

    if(file){
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file));
      setIsImageChanged(true); // une nouvelle image a été choisie
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

  // UPDATE IMAGE FROM Cloudinary
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
          setIsImageChanged(false); // on débloque le bouton
          return;
      }

      setImageFileUploadSuccess("Image charger avec succès.");
      // Si la personne change sa photo on aura ce deux infos.
      setFormData(
        {
          ...userFormData, 
          profilePicture: uploadData.url, 
          profilePictureId: uploadData.public_id
        }
      )

      setIsImageChanged(false);

    } catch (error) {
        
        setImageFileUploading(false);
        setImageFileUploadError(
            error.message || "Une erreur est survenue."
        );
        setPreviewUrl(null);
        setIsImageChanged(false); // on débloque le bouton
    }

  }

  // UPDATE USER INFO CHANGE VALUE
  const handlerChange = (e) => {
    setFormData({ ...userFormData, [e.target.id]: e.target.value })
  }

  // UPDATE USER INFO
  const hanlerSubmit = async (e) => {
    e.preventDefault()

    setUpdateUserError(null)
    setUpdateUserSuccess(null)

    if(Object.keys(userFormData).length === 0){
      setUpdateUserError("Veuillez changé l'une des informations.")
      return
    }

    try {

      dispatch(uploadStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, 
        {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(userFormData)
        }
      )

      const data = await res.json()

      if( !res.ok ){
        dispatch(uploadFailure(data.message))
        setUpdateUserError(data.message)
      }else{
        dispatch(uploadSuccess(data))
        setUpdateUserSuccess("User profile mise a jour")
      }

    } catch (error) {
      dispatch(uploadFailure(error.message))
      setUpdateUserError(error.message)
    }

  }


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
        <form action="" className="flex flex-col gap-4" onSubmit={hanlerSubmit}>
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
                      Chargement de l'image en cours...
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
          {
            updateUserSuccess && (
              <Alert color="success">
                {updateUserSuccess}
              </Alert>
            )
          }
          {
            updateUserError && (
              <Alert color="failure">
                {updateUserError}
              </Alert>
            )
          }
          <TextInput 
            type="text" 
            id="username" 
            placeholder="username" 
            defaultValue={currentUser.username} 
            onChange={handlerChange}
          />
          <TextInput 
            type="email" 
            id="email" 
            placeholder="email" 
            defaultValue={currentUser.email} 
            onChange={handlerChange}
          />
          <TextInput 
            type="password" 
            id="password" 
            placeholder="password" 
            onChange={handlerChange}
          />
          <Button 
            type="submit" 
            disabled={isImageChanged || imageFileUploading}
            className="cursor-pointer"
            >
              Update
            </Button>
        </form>
        <div className="mt-5 text-red-500 flex justify-between">
          <span className="cursor-pointer">Delete account</span>
          <span className="cursor-pointer">Sign out</span>
        </div>
    </div>
  )
}

export default DashProfile
