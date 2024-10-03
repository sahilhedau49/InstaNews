import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserNews } from "../context/news";
import Axios from "axios";

const Article = () => {
  const { id } = useParams();
  const { news } = UserNews();
  const article = news[id];

  return (
    <div className="p-4">
      {article ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
          <p className="text-gray-700 mb-4">{article.content}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            Read full article here
          </a>
        </div>
      ) : (
        <p>Article not found</p>
      )}
    </div>
  );
};

export default Article;
