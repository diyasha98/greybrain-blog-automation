import { X, Edit2, Save } from "lucide-react";
import { useState, useEffect } from "react";

export default function BlogModal({ blog, onClose, onSave, mode = "view" }) {
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [editedBlog, setEditedBlog] = useState({
    title: "",
    content: ""
  });

  useEffect(() => {
    if (blog) {
      setEditedBlog({
        title: blog.title || "",
        content: blog.content || ""
      });
      setIsEditMode(mode === "edit");
    }
  }, [blog, mode]);

  if (!blog) return null;

  const handleSave = () => {
    onSave(editedBlog);
    setIsEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 md:p-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-center border-b bg-linear-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold truncate">
              {isEditMode ? "Edit Blog" : blog.title}
            </h2>
            <span className="px-2 md:px-3 py-1 text-xs md:text-sm rounded-full bg-white border border-gray-300 whitespace-nowrap">
              {blog.status}
            </span>
          </div>
          <div className="flex gap-2 ml-2">
            {!isEditMode && onSave && (
              <button
                onClick={() => setIsEditMode(true)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5 text-blue-600" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {isEditMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editedBlog.title}
                  onChange={(e) =>
                    setEditedBlog({ ...editedBlog, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Content (HTML)
                </label>
                <textarea
                  value={editedBlog.content}
                  onChange={(e) =>
                    setEditedBlog({ ...editedBlog, content: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                  rows={15}
                  placeholder="Enter HTML content"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold mb-2 text-gray-700">Preview</h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: editedBlog.content }}
                />
              </div>
            </div>
          ) : (
            <div
              className="prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          )}
        </div>

        {/* Footer */}
        {isEditMode && (
          <div className="p-4 md:p-6 border-t bg-gray-50 flex gap-3 justify-end">
            <button
              onClick={() => setIsEditMode(false)}
              className="px-4 md:px-6 py-2 md:py-3 rounded-lg border border-gray-300 hover:bg-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}