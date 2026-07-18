import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { app } from "../firebase.js"

import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/userSlice.js"
import { useNavigate } from "react-router-dom";


const OAuth = () => {

  const auth = getAuth(app)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handlerGoogleClick = async () => {

    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
        const resultsFromGoogle = await signInWithPopup(auth, provider)
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL,
            })
        })
        
        const data = await res.json()

        dispatch(signInSuccess(data))
        navigate('/')

    } catch ( error ){
        console.log(error)
    }

  }

  return (
    <Button type="button" className="cursor-pointer" color="alternative" pill onClick={handlerGoogleClick}>
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue avec Google
    </Button>
  )
}

export default OAuth
