import React, { useState } from "react";
import { UserAuth } from "../context/auth";
import { loadStripe } from "@stripe/stripe-js/pure";
import { db } from "../Firebase";
import { get, ref, update } from "firebase/database";

const BuyCredits = () => {
  const [count, setCount] = useState(0);
  const { user } = UserAuth();

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  const addCredits = async (username, purchasedCredits) => {
    try {
      const userRef = ref(db, `users/${username}/credits`);

      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const currentCredits = snapshot.val();
        await update(ref(db, `users/${username}`), {
          credits: currentCredits + purchasedCredits,
        });

        console.log(
          `Credits updated successfully. New balance: ${
            currentCredits + purchasedCredits
          }`
        );
      } else {
        console.log("User not found.");
      }
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };

  const handlePurchase = async () => {
    addCredits(user.email.split("@")[0], count);

    const stripe = await loadStripe(
      "pk_test_51OCLURSBwEURRPsmktzwpWbkEkOr6KJo060qt2mDBnT4pu2N6L1YoFPU4g40UZ5InZc0gGNdPq7vuHFCi2gqdY0x00zFkjSIL7"
    );

    const product = {
      credits: count,
    };

    const body = {
      product: product,
      userData: user.email.split("@")[0],
    };

    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      `http://localhost:8000/create-checkout-session`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col my-20">
      <p className="text-xl">Select the number of credits</p>
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <button
          onClick={decrement}
          className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
          disabled={count === 0}
        >
          -
        </button>
        <span className="text-2xl font-semibold">{count}</span>
        <button
          onClick={increment}
          className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
        >
          +
        </button>
      </div>
      <button
        onClick={handlePurchase}
        className="text-xl mt-4 px-10 py-2 rounded-full border-2 border-gray-900"
      >
        Buy
      </button>
    </div>
  );
};

export default BuyCredits;
