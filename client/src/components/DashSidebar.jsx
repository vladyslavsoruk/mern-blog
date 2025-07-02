import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { FaUsers, FaComments } from "react-icons/fa";

import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state) => state.user);

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
        <SidebarItemGroup className="flex flex-col gap-1">
          <SidebarItem
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser?.isAdmin ? "Admin" : "User"}
            labelColor="dark"
            as="div"
          >
            <Link to="/dashboard?tab=profile">Profile</Link>
          </SidebarItem>

          {currentUser?.isAdmin && (
            <>
              <SidebarItem
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                <Link to="/dashboard?tab=posts">Posts</Link>
              </SidebarItem>
              <SidebarItem active={tab === "users"} icon={FaUsers} as="div">
                <Link to="/dashboard?tab=users">Users</Link>
              </SidebarItem>
              <SidebarItem
                active={tab === "comments"}
                icon={FaComments}
                as="div"
              >
                <Link to="/dashboard?tab=comments">Comments</Link>
              </SidebarItem>
            </>
          )}

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
