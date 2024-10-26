import React, { useState } from "react";
import AIContorls from "./AIContorls";

const CustomSummary = () => {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="bg-gray-300">
      <div className="bg-gray-300 py-4 text-center">
        <h1 className="text-2xl font-semibold mb-6">Enter text to summarize</h1>
        <textarea
          rows="6"
          cols="80"
          placeholder="Text to summarize"
          className="px-4 py-1 border-2 border-gray-600 rounded-xl"
          onChange={handleChange}
        />
      </div>
      <div className="w-1/2 mx-auto">
        <AIContorls content={text} />
      </div>
    </div>
  );
};

export default CustomSummary;
