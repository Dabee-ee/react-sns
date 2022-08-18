import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";

const PostFactory = ({ userObj }) => {
  const [post, setPost] = useState("");
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
    <form onSubmit={onSubmit}>
      <input
        value={post}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Nweet" />
      {thumbnail && (
        <div>
          <img src={thumbnail} width="50px" height="50px" />
          <button onClick={onClearThumbnailClick}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default PostFactory;
