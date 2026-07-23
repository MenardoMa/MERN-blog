import { 
    Avatar, 
    Button, 
    Dropdown, 
    DropdownHeader, 
    Navbar, 
    NavbarCollapse, 
    NavbarLink, 
    NavbarToggle, 
    TextInput, 
    DropdownItem,
    DropdownDivider  
} from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from "../redux/theme/themeSlice.js"

import { signoutSuccess } from "../redux/user/userSlice.js"

const Header = () => {

  const path = useLocation().pathname
  const dispatch = useDispatch()
  const { currentUser } = useSelector(state => state.user )
  const { theme } = useSelector(state => state.theme)

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
    <Navbar className="border-b-2">
        <Link to="/" className="self-center whitespace-normal text-sm sm:text-xl font-semibold dark:text-white">
            <span 
                className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl">
                    Mern
                </span>
            Blog
        </Link>
        <form action="">
            <TextInput
                type="text"
                placeholder="Search ...."
                rightIcon={AiOutlineSearch}
                className="hidden lg:inline"
            />
        </form>
        <Button className="w-12 h-10 lg:hidden cursor-pointer" color='gray' pill>
            <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
            <Button className="w-12 h-10 hidden sm:inline cursor-pointer" color="gray" pill
                onClick={() => dispatch(toggleTheme())}
            >
                {
                    theme === "light"  ? <FaMoon /> : <FaSun />
                }
            </Button>
            {
                currentUser ? 
                <>
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                className="cursor-pointer"
                                rounded
                                alt="user"
                                img={currentUser.profilePicture}
                            />
                        }
                    >
                        <DropdownHeader>
                            <span className="block text-sm">{currentUser.username}</span>
                            <span className="block truncate text-sm font-medium">{currentUser.email}</span>
                        </DropdownHeader>
                            <Link to="/dashboard?tab=profile">
                                <DropdownItem>
                                    Profile
                                </DropdownItem>
                            </Link>
                            <DropdownDivider />
                            <Link 
                                to="#"
                                onClick={handlerSignOut}
                            >
                                <DropdownItem>
                                    Sign out
                                </DropdownItem>
                            </Link>
                    </Dropdown>
                </> 
                : 
                <>
                    <Link to="sign-in">
                        <Button className="cursor-pointer" color="purple" outline>
                            Sign In
                        </Button>
                    </Link>
                </>
            }
            
            <NavbarToggle />
        </div>
        <NavbarCollapse>
            <NavbarLink as={Link} to="/" active={path === "/"}>
                Home
            </NavbarLink>
            <NavbarLink as={Link} to="/about" active={path === "/about"}>
                About
            </NavbarLink>
            <NavbarLink as={Link} to="/projects" active={path === "/projects"}>
                Projects 
            </NavbarLink>
        </NavbarCollapse>
    </Navbar>
  )
}

export default Header
