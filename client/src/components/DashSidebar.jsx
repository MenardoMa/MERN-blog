import { 
  Sidebar, 
  SidebarItem, 
  SidebarItemGroup, 
  SidebarItems 
} from "flowbite-react";
import { 
  HiArrowSmRight, 
  HiDocumentText, 
  HiOutlineChatAlt, 
  HiOutlineUserGroup, 
  HiUser 
} from "react-icons/hi";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useSelector } from 'react-redux';

const DashSidebar = () => {

  const location = useLocation()
  const [tab, setTab] = useState('')

  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {

    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')

    if(tabFromUrl){
      setTab(tabFromUrl)
    }

  }, [location])

  return (
    <Sidebar className="w-full md:w-56">
      <SidebarItems>
        <SidebarItemGroup className="flex flex-col gap-1">
          {
            currentUser.isAdmin && 
            <>
              <SidebarItem
                as={Link}
                to="/dashboard?tab=dash"
                icon={HiDocumentText}
                active={tab === "dash"}
              >
                Dashboard        
              </SidebarItem>
              </>
          }
          <SidebarItem
            as={Link}
            to="/dashboard?tab=profile"
            icon={HiUser}
            active={tab === "profile"}
            label={ currentUser.isAdmin ? "Admin" : "User"}
            labelColor="dark"
          >
            Profile
          </SidebarItem>
          {
            currentUser.isAdmin && 
            <>
              <SidebarItem
                as={Link}
                to="/dashboard?tab=posts"
                icon={HiDocumentText}
                active={tab === "posts"}
              >
                Posts        
              </SidebarItem>
              <SidebarItem
                as={Link}
                to="/dashboard?tab=users"
                icon={HiOutlineUserGroup}
                active={tab === "users"}
              >
                User        
              </SidebarItem>
              <SidebarItem
                as={Link}
                to="/dashboard?tab=comment"
                icon={HiOutlineChatAlt}
                active={tab === "comment"}
              >
                Comments        
              </SidebarItem>
            </>
          }
          
          <SidebarItem icon={HiArrowSmRight}  className="cursor-pointer">
            Profile
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}

export default DashSidebar
