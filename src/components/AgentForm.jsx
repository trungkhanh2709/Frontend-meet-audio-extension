import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AgentForm = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [pageContent, setPageContent] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setChatResponse("");
    setChatHistory([]);
    setSuggestedActions([]);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/agent`, { url });
      setResult(res.data.summary);
      setPageContent(res.data.fullContent);
      setSuggestedActions(res.data.suggestedActions || []);
    } catch (err) {
      setResult("Đã xảy ra lỗi khi xử lý.");
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (messageContent) => {
    const newMessage = { role: "user", content: messageContent };
    const updatedHistory = [...chatHistory, newMessage];

    setChatLoading(true);
    setChatHistory(updatedHistory);
    setChatInput("");

    try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/agent-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory,
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

  const handleChat = () => {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
  };

  const handleSuggestionClick = (suggestionText) => {
    sendChatMessage(suggestionText);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-xl w-3/4 mx-auto bg-white shadow-md min-h-[100vh]">
      <div className="container">
        <h1 className="py-4 text-center text-lg font-bold">
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
            className="border text-black hover:bg-black hover:text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Chạy Agent"}
          </button>
        </form>

        <div className="mt-4 whitespace-pre-wrap text-gray-800">{result}</div>

        {/* Gợi ý hành động */}
        {suggestedActions.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold text-sm mb-2">✨ Gợi ý hành động:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedActions.map((action, idx) => (
                <button
                  key={idx}
                  className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                  onClick={() => handleSuggestionClick(action.label)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat */}
        <div
          className="mt-6 space-y-2 px-2 overflow-y-auto border-t pt-4"
          style={{ maxHeight: "500px" }}
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow text-sm ${
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

        {/* Nhập chat */}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChat();
                  }
                }}
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleChat}
                disabled={chatLoading}
              >
                {chatLoading ? "Đang trả lời..." : "Gửi"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentForm;
