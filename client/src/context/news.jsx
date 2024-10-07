import { createContext, useContext, useState, useEffect } from "react";
import Axios from "axios";

export const NewsContext = createContext();

export const NewsContextProvider = ({ children }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await Axios.get(
        `https://newsapi.org/v2/everything?domains=indiatoday.in,ndtv.com,news18.com,indianexpress.com,timesofindia.indiatimes.com&language=en&apiKey=${
          import.meta.env.VITE_NEWS_API_KEY
        }`
      );

      console.log(res);
      setNews(res.data.articles);
    };

    fetchData();
  }, []);

  return (
    <NewsContext.Provider
      value={{
        news,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const UserNews = () => {
  return useContext(NewsContext);
};
