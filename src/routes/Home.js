import Post from "components/Post";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const postObj = {
      text: post,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    };
    await dbService.collection("posts").add(postObj);
    setPost("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setPost(value);
  };
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
      <form onSubmit={onSubmit}>
        <input
          value={post}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Post" />

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
      </form>
    </div>
  );
};
export default Home;
