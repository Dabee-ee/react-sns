import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Post = ({ postObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newPost, setNewPost] = useState(postObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are yuu sure you want to delete this post?");
    if (ok) {
      await dbService.doc(`posts/${postObj.id}`).delete();
      await storageService.refFromURL(postObj.fileUrl).delete();
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setNewPost(postObj.text);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewPost(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`posts/${postObj.id}`).update({
      text: newPost,
    });
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your post"
              value={newPost}
              onChange={onChange}
              required
            />
          </form>
          <button type="button" onClick={toggleEditing}>
            Cancel
          </button>
          <button type="submit" onClick={onSubmit}>
            Submit
          </button>
        </>
      ) : (
        <>
          <h4>{postObj.text}</h4>
          {postObj.fileUrl && (
            <img src={postObj.fileUrl} width="300px" height="300px" />
          )}
          {isOwner && (
            <>
              <button type="button" onClick={toggleEditing}>
                Edit
              </button>
              <button type="button" onClick={onDeleteClick}>
                Delete
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Post;
