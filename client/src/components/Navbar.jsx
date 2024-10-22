import React from "react";
import Logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/auth";

const Navbar = () => {
  const { SignOut, user } = UserAuth();
  const navigate = useNavigate();

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
          {user && user.email && (
            <p className="font-semibold text-lg md:hidden">
              {user.email.split("@")[0]}
            </p>
          )}
          <button
            onClick={handleSignOut}
            disabled={!user || !user?.emailVerified}
            className="py-3 border-2 border-zinc-500 text-zinc-100 disabled:invisible px-4 bg-zinc-700 rounded-xl md:rounded-md hover:bg-zinc-300 duration-200 hover:text-zinc-800 md:py-2"
          >
            Sign Out
          </button>
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
