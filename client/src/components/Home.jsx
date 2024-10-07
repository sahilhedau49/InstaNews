import React from "react";
import { Link } from "react-router-dom";
import { UserNews } from "../context/news";

const Home = () => {
  const { news } = UserNews();

  return (
    <div className="py-10">
      <div className="px-20 pb-10 text-3xl font-semibold">
        <h1>All latest articles</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 px-20">
        {news?.map((article, index) => (
          <div
            key={index}
            className="flex flex-col justify-between bg-slate-100 p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
          >
            <div className="flex justify-between mb-4">
              <div className="w-[60%]">
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <p className="text-gray-700">
                  {`${article.description.substring(0, 150)}...`}
                </p>
              </div>
              <div className="flex w-[30%] place-items-center">
                <img
                  src={article.urlToImage}
                  className="w-full"
                  alt={article.title}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">{`Published at ${
                article.publishedAt.split("T")[0]
              } by ${article.source.name}`}</p>
              <Link to={`/article/${index}`} className="text-blue-500">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
