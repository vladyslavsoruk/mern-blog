import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";

import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useLocation } from "react-router-dom";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentTab = urlParams.get("tab");
    setTab(currentTab);
  }, [location.search]);

  return (
    <Sidebar className="h-full w-full">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem
            active={tab === "profile"}
            href="/dashboard?tab=profile"
            icon={HiUser}
            label="User"
            labelColor="dark"
          >
            Profile
          </SidebarItem>
          <SidebarItem icon={HiArrowSmRight} className="cursor-pointer">
            Logout
          </SidebarItem>
          {/* <SidebarItem href="/dashboard?tab=settings" icon="cog">
            Settings
          </SidebarItem>
          <SidebarItem href="/dashboard?tab=projects" icon="folder">
            Projects
          </SidebarItem>
          <SidebarItem href="/dashboard?tab=reports" icon="chart-bar">
            Reports
          </SidebarItem>
          <SidebarItem href="/dashboard?tab=help" icon="question-circle">
            Help
          </SidebarItem>
          <SidebarItem href="/dashboard?tab=logout" icon="sign-out-alt">
            Logout
          </SidebarItem> */}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

export default DashSidebar;
