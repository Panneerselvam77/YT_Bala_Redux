import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectUserById } from "./userSlice";
import { selectPostsByUser } from "../Posts/postSlice";

export const UserPage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, Number(userId)));

  const postsForUser = useSelector((state) =>
    selectPostsByUser(state, Number(userId))
  );
  console.log(postsForUser);

  const postTitle = postsForUser.map((post, index) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  console.log(postTitle);
  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{postTitle}</ol>
    </section>
  );
};
