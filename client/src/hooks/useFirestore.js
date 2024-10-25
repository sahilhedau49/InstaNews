import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { get, ref } from "firebase/database";
import { db } from "../Firebase";

const useFirestore = () => {
  const { user } = UserAuth();

  const getCreits = async () => {
    try {
      const username = user.email.split("@")[0];
      const q = query(collection(db, username, "data"));

      onSnapshot(q, (QuerySnapshot) => {
        console.log(QuerySnapshot);
        // here we will get credits.
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getWatchlist = async () => {
    try {
      const username = user.email.split("@")[0];
      const q = query(collection(db, username, "data"));

      onSnapshot(q, (QuerySnapshot) => {
        console.log(QuerySnapshot);
        // here we will get watchlist.
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCreditsByUsername = async (username) => {
    try {
      const snapshot = await get(ref(db, `users/${username}/credits`));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available for this username");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving credits:", error);
    }
  };

  return { getCreits, getWatchlist, getCreditsByUsername };
};

export default useFirestore;
