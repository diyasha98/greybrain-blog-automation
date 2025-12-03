import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import TopicsPage from "./pages/TopicsPage";
import BlogsPage from "./pages/BlogsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("topics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="flex-1 overflow-auto">
        {currentPage === "topics" ? (
          <TopicsPage showToast={showToast} />
        ) : (
          <BlogsPage showToast={showToast} />
        )}
      </div>

      <Toast toast={toast} />
    </div>
  );
}
