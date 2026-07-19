import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  
  const { currentUser } = useSelector(state => state.user)

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
        <form action="" className="flex flex-col gap-4">
          <div className="w-32 h-32 self-center shadow-md overflow-hidden rounded-full">
            <img 
              src={currentUser.profilePicture} 
              alt="Avatar user" 
              className="rounded-full cursor-pointer object-cover w-full border-8 border-[lightgray]" 
            />
          </div>
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
