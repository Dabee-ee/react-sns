import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const PostFactory = ({ userObj }) => {
  const [post, setPost] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const onSubmit = async (event) => {
    if (post === "") {
      return;
    }
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
  const onClearThumbnailClick = () => setThumbnail("");

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={post}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {thumbnail && (
        <div className="factoryForm__attachment">
          <img
            src={thumbnail}
            style={{
              backgroundImage: thumbnail,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearThumbnailClick}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default PostFactory;
