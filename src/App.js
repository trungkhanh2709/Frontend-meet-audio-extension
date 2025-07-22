import React from "react";
import AgentForm from "./components/AgentForm";
import SearchHistory from "./components/AgentWithHistory"; // bạn sẽ tạo file này

function App() {
  return (
    <div className="flex h-screen">
      

      {/* Form nhập Agent bên phải */}
    
        <AgentForm />
    </div>
  );
}

export default App;
