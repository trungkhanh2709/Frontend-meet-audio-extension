// src/App.jsx
import { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5000/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Web Agent</h1>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Nhập URL..." className="border p-2 w-full mb-4"/>
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Phân tích</button>
      {result && (
        <div className="mt-6">
          <h2 className="font-bold text-lg">Tóm tắt:</h2>
          <p>{result.summary}</p>
        </div>
      )}
    </div>
  );
}
