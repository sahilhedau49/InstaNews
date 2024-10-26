import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/auth";
import useFirestore from "../hooks/useFirestore";
import { get, ref } from "firebase/database";
import { db } from "../Firebase";

const Navbar = () => {
  const { SignOut, user } = UserAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [credits, setCredits] = useState(0);

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
    try {
      const snapshot = await get(
        ref(db, `users/${user.email.split("@")[0]}/credits`)
      );
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const cc = snapshot.val();

        setCredits(typeof cc === "number" ? cc : cc?.credits);
      } else {
        console.log("No data available for this username");
      }
    } catch (error) {
      console.error("Error retrieving credits:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await SignOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="flex border-b-2 border-black px-20 py-4 justify-between">
        <Link to={"/"}>
          <img src={Logo} alt="InstaNews Logo" className="w-24" />
        </Link>
        <div className="flex gap-10 place-items-center">
          <a
            className="text-lg font-semibold duration-200"
            href="https://fake-news-project.streamlit.app/"
            target="_blank"
          >
            Fake News Checker
          </a>

          <Link
            className="text-lg font-semibold duration-200"
            to={"/customSummary"}
          >
            Custom Summarizer
          </Link>

          {user && user.email && (
            <div>
              <button
                onClick={toggleModal}
                className="text-lg font-semibold focus:outline-none"
              >
                {user.email.split("@")[0]}
              </button>

              {isModalOpen && (
                <div className="absolute right-[22rem] top-2 mt-2 w-fit bg-white rounded-lg shadow-lg py-2 text-black">
                  <div className="px-4 py-2 flex justify-between place-items-center gap-4">
                    <p>Credits ⚡ {credits}</p>
                    <Link
                      to={"/buyCredits"}
                      className="px-2 py-1 border-2 rounded-3xl"
                    >
                      Buy ⚡
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {user && user.email !== "" && (
            <button
              onClick={handleSignOut}
              className="py-3 border-2 border-zinc-500 text-zinc-100 px-4 bg-zinc-700 rounded-xl md:rounded-md hover:bg-zinc-300 duration-200 hover:text-zinc-800 md:py-2"
            >
              Sign Out
            </button>
          )}
          {!user && (
            <button
              onClick={handleLogIn}
              className="py-3 border-2 border-zinc-500 text-zinc-100 disabled:invisible px-4 bg-zinc-700 rounded-xl md:rounded-md hover:bg-zinc-300 duration-200 hover:text-zinc-800 md:py-2"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
