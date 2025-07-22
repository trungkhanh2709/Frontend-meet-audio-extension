import { useEffect, useState } from "react";
import axios from "axios";

const AgentWithHistory = () => {
  const [history, setHistory] = useState([]);
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState("");

  const API_URL =  process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/agent`, { url });
      setResponse(res.data.summary);
      setUrl("");
      await fetchHistory(); // Refresh history
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleHistoryClick = (item) => {
    setResponse(item.summary);
    setUrl(item.url);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - History */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-semibold mb-4">🕘 Lịch sử tìm kiếm</h2>
        {history.map((item, idx) => (
          <div
            key={idx}
            className="mb-3 p-2 border rounded bg-white cursor-pointer hover:bg-gray-200"
            onClick={() => handleHistoryClick(item)}
          >
            <p className="text-blue-600 text-sm truncate">{item.url}</p>
            <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="w-3/4 p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Nhập URL trang web..."
            className="border p-2 w-2/3 rounded mr-2"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Gửi
          </button>
        </form>

        {response && (
          <div className="bg-white p-4 border rounded shadow">
            <h3 className="font-bold mb-2">Tóm tắt:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentWithHistory;
