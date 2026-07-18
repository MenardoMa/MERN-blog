
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux"
import { 

  signInStart, 
  signInSuccess, 
  signInFailure 

} from "../redux/user/userSlice.js"
import OAuth from "../components/OAuth.jsx";

const SignIn = () => {

  const [formData, setForm] = useState({})

  const {loading, error: errorMessage} = useSelector(state => state.user)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handlerChange = (e) => {
    setForm({...formData, [e.target.id]: e.target.value.trim()})
  }

 const handlerSubmit = async (e) => {
    e.preventDefault()

    if(!formData.email || !formData.password){
      dispatch(signInFailure('Tous les champs doivent etre remplis'))
    }

    try {
      
      dispatch(signInStart())

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if(data.success === false){
        dispatch(signInFailure(data.message))
      }

      if(res.ok){
        dispatch(signInSuccess(data))
        navigate("/")
      }

    } catch (error) {
        dispatch(signInFailure(error.message))
    }
 }

  return (
    <div className="min-h-screen mt-20">
      <div className="mx-auto flex p-3 max-w-3xl flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span 
                className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl">
                  Mern
              </span>
              Blog
          </Link>
          <p className="text-sm md:text-base mt-5">
            This is a demo Project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/* Right */}
        <div className="flex-1">
          {
            errorMessage && (
              <Alert className="mb-5" color="failure">
                {errorMessage}
              </Alert>
            )
          }
          <form className="flex flex-col gap-4" onSubmit={handlerSubmit}>
              <div>
                  <Label className="" htmlFor="email">Your email</Label>
                  <TextInput type="email" placeholder="test@gmail.com" id="email" onChange={handlerChange} />
              </div>
              <div>
                  <Label className="" htmlFor="password">Your password</Label>
                  <TextInput type="password" placeholder="*********" id="password" onChange={handlerChange} />
              </div>
              <Button type="submit" className="cursor-pointer" disabled={loading}>
                  {
                    loading ? (
                      <>
                        <Spinner size="sm"/>
                      <span className="pl-3">Loading ...</span>
                      </>
                    ) :
                    'Sign Up'
                  }
              </Button>
              <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Tu n'as un compte ? creer-un </span>
            <Link to='/sign-up' className="text-blue-500">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
