import React, { useEffect, useState } from "react";
import {
  getBlogs,
  generateBlog,
  approveBlog,
  rejectBlog,
  publishBlog,
  updateBlog,
  deleteBlog,
} from "../API/blogs";
import { getTopics } from "../API/topics";
import BlogModal from "../components/BlogModal";
import {
  Send,
  Check,
  XCircle,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Loader,
} from "lucide-react";

export default function BlogsPage({ showToast }) {
  const [blogs, setBlogs] = useState({
    pending: [],
    approved: [],
    published: [],
    rejected: [],
  });
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
    loadTopics();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await getBlogs();
      const data = res.data.data;

      setBlogs({
        pending: data.pending || [],
        approved: data.approved || [],
        published: data.published || [],
        rejected: data.rejected || [],
      });
    } catch (error) {
      showToast("Failed to load blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    try {
      const res = await getTopics();
      setTopics(res.data.data);
    } catch (error) {
      showToast("Failed to load topics", "error");
    }
  };

  const handleGenerateBlog = async () => {
    if (!selectedTopic) return showToast("Select a topic first", "error");

    setGenerating(true);
    try {
      await generateBlog(selectedTopic);
      showToast("Blog generated successfully");
      setSelectedTopic("");
      loadBlogs();
    } catch (error) {
      showToast("Failed to generate blog", "error");
    } finally {
      setGenerating(false);
    }
  };

  const updateBlogStatus = async (id, action) => {
    try {
      const actionHandler = {
        approve: approveBlog,
        reject: rejectBlog,
        publish: publishBlog,
      };

      await actionHandler[action](id);
      showToast(`Blog ${action}d successfully`);
      loadBlogs();
    } catch (error) {
      showToast(`Failed to ${action} blog`, "error");
    }
  };

  const handleUpdateBlog = async (updatedData) => {
    try {
      await updateBlog(selectedBlog.id, updatedData);
      showToast("Blog updated successfully");
      setSelectedBlog(null);
      loadBlogs();
    } catch (error) {
      showToast("Failed to update blog", "error");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog permanently?")) {
      return;
    }

    try {
      await deleteBlog(id);
      showToast("Blog deleted successfully");
      loadBlogs();
    } catch (error) {
      showToast("Failed to delete blog", "error");
    }
  };

  const openBlogModal = (blog, mode = "view") => {
    setSelectedBlog(blog);
    setModalMode(mode);
  };

  const tabs = [
    { key: "pending", label: "Pending", count: blogs.pending.length, color: "orange" },
    { key: "approved", label: "Approved", count: blogs.approved.length, color: "green" },
    { key: "published", label: "Published", count: blogs.published.length, color: "blue" },
    { key: "rejected", label: "Rejected", count: blogs.rejected.length, color: "red" },
  ];

  const currentBlogs = blogs[activeTab] || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Blog Management
          </h1>
          <p className="text-gray-600">Generate, review, and publish your blogs</p>
        </div>

        {/* Generate Blog Section */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 md:p-8 rounded-2xl shadow-xl mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <Send className="w-6 h-6" />
            Generate New Blog
          </h2>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              className="p-3 md:p-4 rounded-xl text-gray-900 flex-1 font-medium outline-none focus:ring-4 focus:ring-white/30 transition-all"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={generating}
            >
              <option value="">Select a topic...</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateBlog}
              disabled={generating || !selectedTopic}
              className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[120px] px-4 md:px-6 py-4 md:py-5 font-semibold transition-all relative ${
                  activeTab === tab.key
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm md:text-base">{tab.label}</span>
                  <span
                    className={`text-xs md:text-sm px-2 py-0.5 rounded-full ${
                      activeTab === tab.key
                        ? `bg-${tab.color}-100 text-${tab.color}-700`
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          {/* Blog List */}
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : currentBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  No blogs found
                </h3>
                <p className="text-gray-500">
                  {activeTab === "pending"
                    ? "Generate a new blog to get started"
                    : `No ${activeTab} blogs yet`}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {currentBlogs.map((blog)  => 
                (
                  <div
                    key={blog.id}
                    className="bg-white border border-gray-200 p-4 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                          {blog.createdAt && (
                            <span>
                              Created: {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap ${
                          blog.status === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : blog.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : blog.status === "published"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                        onClick={() => openBlogModal(blog, "view")}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                        onClick={() => openBlogModal(blog, "edit")}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>

                      {blog.status?.toLowerCase() === "pending" && (
                        <>
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium"
                            onClick={() => updateBlogStatus(blog.id, "approve")}
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
                            onClick={() => updateBlogStatus(blog.id, "reject")}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}

                      {blog.status?.toLowerCase() === "approved" && (
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors text-sm font-medium"
                          onClick={() => updateBlogStatus(blog.id, "publish")}
                        >
                          <Send className="w-4 h-4" />
                          Publish Now
                        </button>
                      )}

                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium ml-auto"
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BlogModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
        onSave={handleUpdateBlog}
        mode={modalMode}
      />
    </div>
  );
}