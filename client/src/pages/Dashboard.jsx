import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

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
      {tab === "profile" ? <DashProfile /> : null}
    </div>
  );
}

export default Dashboard;
