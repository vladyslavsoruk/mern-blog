import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";

import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentTab = urlParams.get("tab");
    setTab(currentTab);
  }, [location.search]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });
      if (!response.ok) {
        return new Error("Failed to logout");
      }
      dispatch(signOutSuccess()); // Clear user state on logout
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

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
          <SidebarItem
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

export default DashSidebar;
