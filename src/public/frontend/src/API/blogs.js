import api from "./axiosClient";

export const getBlogs = () => api.get("/blogs");
export const getApprovedBlogs = () => api.get("/blogs/approved");
export const getBlogContent = (id) => api.get(`/blogs/${id}`);

export const generateBlog = (topicId) =>
  api.post(`/blogs/generate?topicId=${topicId}`);

export const approveBlog = (id) => api.get(`/blogs/approve/${id}`);
export const rejectBlog = (id) => api.get(`/blogs/reject/${id}`);
export const publishBlog = (id) => api.get(`/blogs/publish/${id}`);

export const updateBlog = (id, data) => api.post(`/blogs/update/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/delete/${id}`);