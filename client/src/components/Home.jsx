import React from "react";
import { Link } from "react-router-dom";
import { UserNews } from "../context/news";

const Home = () => {
  const { news } = UserNews();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {news?.map((article, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
        >
          <h3 className="font-bold text-lg mb-2">{article.title}</h3>
          <p className="text-gray-700 mb-4">{article.description}</p>
          <Link to={`/article/${index}`} className="text-blue-500">
            Read More
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
