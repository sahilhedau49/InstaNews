import React, { useState } from "react";
import { UserAuth } from "../context/auth";
import { Link } from "react-router-dom";
import ErrorSign from "./ErrorSign";
import { ref, set } from "firebase/database";
import { db } from "../Firebase";

const Signup = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const { veriMsg, emailSignIn, errWhileSign } = UserAuth();

  const getData = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await emailSignIn(data.email, data.password);

      const userRef = ref(db, `users/${data.email.split("@")[0]}/credits`);
      await set(userRef, 10);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="overflow-y-hidden min-h-[90vh] flex flex-col mt-10">
      <h1 className="text-3xl text-center font-semibold">Sign Up</h1>
      <form>
        <div className="hero">
          <div className="hero-content flex-col md:w-screen md:px-4">
            <div className="card w-[30rem] shadow-2xl bg-base-100 md:w-[95%]">
              <div className="card-body md:py-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    onChange={getData}
                    placeholder="email"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Create Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={getData}
                    placeholder="password"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control mt-6">
                  <button onClick={handleSubmit} className="btn btn-primary">
                    Sign Up
                  </button>
                  <Link
                    className="underline mt-2 text-xs text-center"
                    to="/login"
                  >
                    Already have an account? Log in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {errWhileSign && !veriMsg && <ErrorSign />}
      {veriMsg && (
        <div className="fixed mt-4 bottom-0 rounded-none alert alert-success">
          Verification link is sent to your mail. Please verify it and reload
          this page.
        </div>
      )}
    </div>
  );
};

export default Signup;
