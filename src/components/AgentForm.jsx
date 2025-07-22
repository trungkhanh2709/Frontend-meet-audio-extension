import React, { useState } from "react";
import axios from "axios";

const AgentForm = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post("http://localhost:5000/api/agent", { url });
      setResult(res.data.summary);
    } catch (err) {
      setResult("Đã xảy ra lỗi khi xử lý.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="url"
          className="border px-3 py-2 rounded w-[300px]"
          placeholder="Nhập URL trang web"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Chạy Agent"}
        </button>
      </form>
      <div className="mt-4 whitespace-pre-wrap text-gray-800">{result}</div>
    </div>
  );
};

export default AgentForm;
