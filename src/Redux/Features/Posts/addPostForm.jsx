import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAdded } from "./postSlice";
import { selectAllusers } from "../User/userSlice";

export default function AddPostForm() {
  const dispatch = useDispatch();
  // States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setuserId] = useState("");
  // Use Selectors
  const users = useSelector(selectAllusers);

  // Event handlers
  const onTitleChange = (e) => setTitle(e.target.value);
  const onContentChange = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setuserId(e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postAdded(title, content, userId));
    }
  };

  const userOption = users.map((user) => (
    <option value={user.name} key={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a new Post</h2>
      <form action="">
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChange}
        />
        <label htmlFor="postAuthor">Post Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          {userOption}
        </select>
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          value={content}
          onChange={onContentChange}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}
