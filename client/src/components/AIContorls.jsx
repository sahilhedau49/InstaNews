import axios from "axios";
import React, { useEffect, useState } from "react";

const AIContorls = ({ content }) => {
  const [summary, setSummary] = useState("");
  const [endpoint, setEndpoint] = useState("bart-large-cnn");
  const [loading, setLoading] = useState(false);

  const handleSelect = (e) => {
    setEndpoint(e.target.value);
  };

  const generateSummary = async () => {
    setSummary("");
    setLoading(true);
    const res = await axios.post(
      `http://localhost:8000/summarize/${endpoint}`,
      { text_to_summarize: content }
    );

    console.log(res);
    setSummary(res.data);
    setLoading(false);
  };

  const [isReading, setIsReading] = useState(false); // Track whether speech is ongoing
  const [isPaused, setIsPaused] = useState(false); // Track if the speech is paused

  const handleReadAloud = () => {
    if (!isReading) {
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Mark reading as started and reset paused state
      setIsReading(true);
      setIsPaused(false);

      // Read the summary aloud
      window.speechSynthesis.speak(utterance);

      // Once speech ends, mark reading as stopped
      utterance.onend = () => {
        setIsReading(false);
      };
    }
  };

  const handlePause = () => {
    if (isReading) {
      if (!isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true); // Speech is now paused
      } else {
        window.speechSynthesis.resume();
        setIsPaused(false); // Resume speech
      }
    }
  };

  useEffect(() => {
    // Stop reading if the component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="p-6 h-fit bg-gray-300 sticky top-[103px]">
      <div className="flex justify-between pb-3 border-b-2 border-gray-400 text-2xl text-center font-semibold">
        <h1>Generate Summary</h1>
      </div>
      <div className="mt-4 flex flex-col place-content-center">
        <select
          value={endpoint}
          onChange={handleSelect}
          className="block w-full p-2 mb-4 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="bart-large-cnn">Bart Large CNN</option>
          <option value="distilbart-cnn-12-6">Distilbart CNN 12-6</option>
        </select>
        <button
          onClick={generateSummary}
          className="w-[50%] mx-auto mb-6 px-6 py-1 duration-200 bg-gray-700 hover:bg-gray-300 text-gray-200 hover:text-gray-800 rounded-xl outline-none text-xl border-2 border-gray-900"
        >
          Generate
        </button>
        <div className="py-2 px-3 min-h-[21rem] rounded-xl border-2 border-gray-500">
          {loading ? (
            <p>loading...</p>
          ) : summary === "" ? (
            <p className="text-gray-500">
              Generated summary will be displayed here...
            </p>
          ) : (
            <p>{summary}</p>
          )}
        </div>
        <div className="flex justify-between mx-4 mt-5">
          <button
            onClick={handlePause}
            className={`bg-red-600 w-fit text-white px-4 py-2 rounded hover:bg-red-700 transition ${
              !isReading && "invisible"
            }`}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={handleReadAloud}
            disabled={isReading}
            className={`${
              isReading ? "bg-gray-400" : "bg-indigo-600"
            } text-white px-4 py-2 rounded hover:bg-indigo-700 transition w-fit`}
          >
            {isReading ? "Reading..." : "Read Aloud"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIContorls;
