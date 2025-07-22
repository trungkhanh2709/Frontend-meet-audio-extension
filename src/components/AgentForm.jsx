import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AgentForm = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [pageContent, setPageContent] = useState(""); // Thêm state mới
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setChatResponse("");
    setChatHistory([]);

    try {
      const res = await axios.post("http://localhost:5000/api/agent", { url });
      setResult(res.data.summary);
      setPageContent(res.data.fullContent); // Lưu nội dung trang web
    } catch (err) {
      setResult("Đã xảy ra lỗi khi xử lý.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const newMessage = { role: "user", content: chatInput };
    const updatedHistory = [...chatHistory, newMessage];

    setChatLoading(true);
    setChatHistory(updatedHistory);
    setChatInput("");

    try {
      const res = await fetch("http://localhost:5000/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory, // Gửi toàn bộ lịch sử
          fullContent: pageContent,
        }),
      });

      const data = await res.json();
      const botMessage = { role: "assistant", content: data.response };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = {
        role: "assistant",
        content: "Lỗi khi gửi yêu cầu tới agent.",
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  return (
    <div className="p-4 border border-gray-300 rounded-xl w-3/4 mx-auto bg-white shadow-md">
      <div className="container">
        <h1 className="py-4 text-center">
          🌐 AI Web Summary Agent (ReelsightAI test)
        </h1>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="url"
            className="border px-3 py-2 rounded w-3/4"
            placeholder="Nhập URL trang web"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            className="border  text-black hover:bg-black hover:text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Chạy Agent"}
          </button>
        </form>
        <div className="mt-4 whitespace-pre-wrap text-gray-800">{result}</div>
        <div
          className="mt-4 space-y-2 px-2 overflow-y-auto"
          style={{ maxHeight: "500px" }}
        >
          {" "}
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 mt-2 rounded-2xl shadow text-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <span className="block text-xs font-semibold mb-1">
                  {msg.role === "user" ? "You" : "Agent"}
                </span>
                <span>{msg.content}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {result && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">💬 Chat với Agent</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                className="border px-3 py-2 rounded w-full"
                placeholder="Nhập câu hỏi hoặc hành động..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleChat}
                disabled={chatLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Ngăn form reload nếu có
                    handleChat();
                  }
                }}
              >
                {chatLoading ? "Đang trả lời..." : "Gửi"}
              </button>
            </div>
            <div className="mt-4 whitespace-pre-wrap text-gray-700">
              {chatResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentForm;
