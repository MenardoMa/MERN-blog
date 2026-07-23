import { 
  Button, 
  TextInput, 
  Alert, 
  Modal, 
  ModalBody, 
  ModalHeader 
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { 
  uploadStart, 
  uploadSuccess, 
  uploadFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signoutSuccess,
} from "../redux/user/userSlice.js"
import { useDispatch } from "react-redux"
import { HiOutlineExclamationCircle } from "react-icons/hi";

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

  const [showModal, setShowModel] = useState(false)

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

  // DELETE A COMPTE
  const handlerDeleteUser = async (e) => {
    e.preventDefault()
    setShowModel(false)

    try {

      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      })

      const data = await res.json()

      if(!res.ok){
        dispatch(deleteUserFailure(data.message))
      }else{
        dispatch(deleteUserSuccess(data))
      }

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }


  }

  // Logout
  const handlerSignOut = async (e) => {
    e.preventDefault()

    try {
      
      const res = await fetch("/api/user/signout", {
        method: "POST"
      })

      const data = await res.json()

      if(!res.ok){
        console.log("ok")
      }else{
        dispatch(signoutSuccess())
      }

    } catch (error) {
      console.log('Une erreur est survenue ' + error.message)
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
          <span 
              className="cursor-pointer" 
              onClick={() => setShowModel(true)}
            >
              Delete account
            </span>
          <span 
            className="cursor-pointer"
            onClick={handlerSignOut}
            >
              Sign out
            </span>
        </div>


        <Modal show={showModal} size="md" onClose={() => setShowModel(false)} popup>
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                 Êtes-vous sûr de vouloir supprimer ce produit ?
              </h3>
              <div className="flex justify-center gap-4">
                <Button 
                  color="red" 
                  className="cursor-pointer"
                  onClick={handlerDeleteUser}
                >
                  Oui, je suis sûr
                </Button>
                <Button 
                  color="alternative" 
                  className="cursor-pointer"
                  onClick={() => setShowModel(false)}
                >
                  Non, annuler
                </Button>
              </div>
            </div>
          </ModalBody>
      </Modal>


    </div>
  )
}

export default DashProfile
