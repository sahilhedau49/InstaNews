import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserNews } from "../context/news";
import Axios from "axios";
import AIContorls from "./AIContorls";

const Article = () => {
  const { id } = useParams();
  const { news } = UserNews();
  const [content, setContent] = useState("");
  const article = news[id];

  useEffect(() => {
    const fetchContent = async () => {
      const res = await Axios.post("http://localhost:8000/getContent", {
        news_url: article.url,
      });

      console.log(res);
      setContent(res.data.content);
    };

    if (article && content === "") fetchContent();
  }, [article]);

  return (
    <div className="flex justify-between">
      {article ? (
        <div className="w-full py-10 px-20">
          <div className="flex justify-between place-items-center mb-10">
            <h1 className="w-[80%] text-3xl font-bold">{article.title}</h1>
            <h1 className="w-[20%]  text-right text-xl text-gray-600">
              By {article.source.name}
            </h1>
          </div>
          <div>
            <img
              className="rounded-md w-3/5 mx-auto"
              src={article.urlToImage}
              alt={article.title}
            />
          </div>
          <div className="mt-10 text-lg text-justify text-gray-800 leading-relaxed space-y-4">
            {content
              ?.split("\n")
              .map(
                (line, index) =>
                  line.trim() !== "" && <p key={index}>{`${line}\n`}</p>
              )}
          </div>
          <div className="block text-right mt-10 text-lg">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Read full article here
            </a>
          </div>
        </div>
      ) : (
        <p>Article not found</p>
      )}
      <div className="w-[30%]">
        <AIContorls content={content} />
      </div>
    </div>
  );
};

export default Article;
