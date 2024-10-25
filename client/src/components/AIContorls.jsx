import axios from "axios";
import { get, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/auth";
import { db } from "../Firebase";

const AIContorls = ({ content }) => {
  const [summary, setSummary] = useState("");
  const [endpoint, setEndpoint] = useState("bart-large-cnn");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const { user } = UserAuth();

  const handleSelect = (e) => {
    setEndpoint(e.target.value);
  };

  const generateSummary = async () => {
    try {
      const snapshot = await get(
        ref(db, `users/${user.email.split("@")[0]}/credits`)
      );
      if (snapshot.exists()) {
        const cc = snapshot.val();
        setCredits(typeof cc === "number" ? cc : cc?.credits || null);
      } else {
        console.log("No data available for this username");
      }
    } catch (error) {
      console.error("Error retrieving credits:", error);
    }

    if (credits === 0) {
      alert("You don't have enough credits...");
      return;
    }

    setSummary("");
    setLoading(true);
    const res = await axios.post(
      `http://localhost:8000/summarize/${endpoint}`,
      { text_to_summarize: content }
    );

    console.log(res);
    setSummary(res.data);
    setLoading(false);

    try {
      const creditRef = ref(db, `users/${user.email.split("@")[0]}/credits`);
      const snapshot = await get(creditRef);
      if (snapshot.exists()) {
        const cc = snapshot.val();
        const currentCredits =
          typeof cc === "number" ? cc : cc?.credits || null;
        const newCredits = Math.max(0, currentCredits - 1);
        await update(creditRef, { credits: newCredits });
        console.log(`Credits updated to:`, newCredits);
      } else {
        console.log("No credits available for this username");
      }
    } catch (error) {
      console.error("Error decrementing credits:", error);
    }
  };

  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleReadAloud = () => {
    if (!isReading) {
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      setIsReading(true);
      setIsPaused(false);

      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        setIsReading(false);
      };
    }
  };

  const handlePause = () => {
    if (isReading) {
      if (!isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } else {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="p-6 h-screen bg-gray-300 sticky top-0">
      <div className="flex justify-between pb-3 border-b-2 border-gray-400 text-2xl text-center font-semibold">
        <h1>Generate Summary</h1>
      </div>
      {user ? (
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
            className="w-fit text-lg mx-auto mb-6 px-6 py-1 duration-200 bg-gray-700 hover:bg-gray-300 text-gray-200 hover:text-gray-800 rounded-xl outline-none border-2 border-gray-900"
          >
            Generate using 1 ⚡
          </button>
          <div className="py-2 px-3 h-[22rem] overflow-y-auto rounded-xl border-2 border-gray-500">
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
      ) : (
        <div className="font-bold text-2xl mt-10">
          <p>Log in to use AI features.</p>
        </div>
      )}
    </div>
  );
};

export default AIContorls;
