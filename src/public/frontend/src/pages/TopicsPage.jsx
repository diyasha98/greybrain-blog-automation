import React, { useEffect, useState } from "react";
import { getTopics, addTopic, deleteTopic, generateTopics } from "../API/topics.js";
import { Trash2, Plus, RefreshCw, Sparkles } from "lucide-react";

export default function TopicsPage({ showToast }) {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadTopics = async () => {
    setLoading(true);
    const res = await getTopics();
    setTopics(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleAddTopic = async () => {
    if (!newTopic.trim()) return;
    await addTopic(newTopic);
    showToast("Topic added successfully");
    setNewTopic("");
    loadTopics();
  };

  const handleDeleteTopic = async (id) => {
    await deleteTopic(id);
    showToast("Topic deleted");
    loadTopics();
  };

  const handleGenerateTopics = async () => {
    setGenerating(true);
    await generateTopics();
    showToast("AI topics generated!");
    setGenerating(false);
    loadTopics();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Topics</h1>
          <p className="text-gray-500">Manage your blog topics</p>
        </div>

        <button
          onClick={handleGenerateTopics}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          {generating ? <RefreshCw className="animate-spin" /> : <Sparkles />}
          Generate AI Topics
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="border p-3 rounded w-full"
          placeholder="New topic name..."
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
        />
        <button
          onClick={handleAddTopic}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          <Plus /> Add
        </button>
      </div>

      {loading ? (
        <p>Loading topics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t) => (
            <div key={t.id} className="p-5 border rounded-xl bg-white shadow-sm flex justify-between">
              <div>
                <h2 className="text-lg font-semibold">{t.name}</h2>
              </div>
              <button onClick={() => handleDeleteTopic(t.id)} className="text-red-500">
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
