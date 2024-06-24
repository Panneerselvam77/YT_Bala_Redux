import React from "react";
import { useSelector } from "react-redux";
import { selectAllusers } from "../User/userSlice";

export default function PostAuthor({ userId }) {
  const users = useSelector(selectAllusers);

  const author = users.filter((user) => user.id === userId);

  return (
    <span>
      by {author ? author.map((author) => author.name) : "unknown author"}
    </span>
  );
}
