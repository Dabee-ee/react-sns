import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your post"
              value={newPost}
              onChange={onChange}
              autoFocus
              className="formInput"
              required
            />
            <input type="submit" value="Update Post" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{postObj.text}</h4>
          {postObj.fileUrl && <img src={postObj.fileUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Post;
