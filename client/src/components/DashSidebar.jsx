import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {

  const location = useLocation()
  const [tab, setTab] = useState('')

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
        <SidebarItemGroup>
          <SidebarItem
            as={Link}
            to="/dashboard?tab=profile"
            icon={HiUser}
            active={tab === "profile"}
            label="User"
            labelColor="dark"
          >
            Profile
          </SidebarItem>
          
          <SidebarItem icon={HiArrowSmRight}  className="cursor-pointer">
            Profile
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}

export default DashSidebar
