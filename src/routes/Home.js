import Post from "components/Post";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import PostFactory from "components/PostFactory";

const Home = ({ userObj }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    dbService.collection("posts").onSnapshot((snapshot) => {
      const postArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postArray);
    });
  }, []);

  return (
    <div>
      <PostFactory userObj={userObj} />
      <span> Post List </span>
      <div>
        {posts.map((post) => (
          <Post
            key={post.id}
            postObj={post}
            isOwner={post.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
