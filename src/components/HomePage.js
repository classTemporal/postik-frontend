import React, { useEffect, useState } from "react";
import getAllPostsInHome from "../services/post-service";
import "./HomePage.css"

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPostsInHome()
      .then(response => {
        setPosts(response.data.content);
      })
      .catch(error => {
        console.error("Error al obtener los posts:", error);
      });
  }, []);

  return (
    <div className="postlist">
      <ul>
        {posts.map(post => (
          <li className="listp" key={post.id}>{post.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
