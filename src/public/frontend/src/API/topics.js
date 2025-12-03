import api from "./axiosClient";

export const getTopics = () => api.get("/topics");
export const addTopic = (topic) => api.post("/topics", { topic });
export const deleteTopic = (id) => api.delete(`/topics/${id}`);
export const generateTopics = () => api.get("/topics/generate");
