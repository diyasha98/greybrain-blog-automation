import { Menu, X, Sparkles, Edit } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) {
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-700 text-white h-screen transition-all duration-300 p-4 flex flex-col`}>
      <div className="flex justify-between items-center mb-6">
        {sidebarOpen && <h1 className="text-2xl font-bold">BlogCraft</h1>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <nav className="space-y-3">
        <button
          onClick={() => setCurrentPage("topics")}
          className={`flex items-center gap-3 p-3 rounded-lg w-full ${currentPage === "topics" ? "bg-white text-blue-700" : "hover:bg-blue-600"}`}
        >
          <Sparkles size={20} />
          {sidebarOpen && "Topics"}
        </button>

        <button
          onClick={() => setCurrentPage("blogs")}
          className={`flex items-center gap-3 p-3 rounded-lg w-full ${currentPage === "blogs" ? "bg-white text-blue-700" : "hover:bg-blue-600"}`}
        >
          <Edit size={20} />
          {sidebarOpen && "Blogs"}
        </button>
      </nav>
    </div>
  );
}
