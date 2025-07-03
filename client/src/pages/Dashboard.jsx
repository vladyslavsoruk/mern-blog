import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import AdminDashboard from "../components/AdminDashboard";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const possibleTabs = ["dashboard", "profile", "posts", "users", "comments"];

  console.log("TAB", tab);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentTab = urlParams.get("tab");
    setTab(currentTab);
  }, [location.search]);

  return (
    <div className="min-h-[calc(100vh-62px)] flex flex-col md:flex-row">
      <div className="w-full md:w-1/4">
        <DashSidebar />
      </div>
      {possibleTabs.includes(tab) === false && <AdminDashboard />}
      {tab === "dashboard" && <AdminDashboard />}
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
    </div>
  );
}

export default Dashboard;
