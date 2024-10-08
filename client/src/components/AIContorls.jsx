import axios from "axios";
import React, { useState } from "react";

const AIContorls = ({ content }) => {
  const [summary, setSummary] = useState("");

  const generateSummary = async () => {
    const res = await axios.post(
      "http://localhost:8000/summarize/bart-large-cnn",
      { text_to_summarize: content }
    );

    // console.log(res);
    setSummary(res.data);
  };

  return (
    <div className="p-6">
      <div className="pb-3 border-b-2 border-gray-400 text-2xl text-center font-semibold">
        <h1>Generate Summary</h1>
      </div>
      <div className="mt-6 flex flex-col place-content-center">
        <button
          onClick={generateSummary}
          className="w-[50%] mx-auto mb-6 px-6 py-1 duration-200 bg-gray-700 hover:bg-gray-300 text-gray-200 hover:text-gray-800 rounded-xl outline-none text-xl border-2 border-gray-900"
        >
          Generate
        </button>
        {summary !== "" && (
          <div className="py-2 px-3 rounded-xl border-2 border-gray-500">
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContorls;
