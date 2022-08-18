import Post from "components/Post";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [thumbnail, setThumbnail] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let fileUrl = "";
    if (thumbnail !== "") {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(thumbnail, "data_url");
      fileUrl = await response.ref.getDownloadURL();
    }

    const postObj = {
      text: post,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      fileUrl,
    };
    await dbService.collection("posts").add(postObj);
    setPost("");
    setThumbnail("");
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
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setThumbnail(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearThumbnailClick = () => setThumbnail(null);

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

        <input type="file" accept="image/*" onChange={onFileChange} />
        {thumbnail && (
          <div>
            <img src={thumbnail} width="300px" height="300px" />
            <button type="button" onClick={onClearThumbnailClick}>
              Clear
            </button>
          </div>
        )}

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
