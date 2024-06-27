import React from "react";
import { useSelector } from "react-redux";
import { selectAllusers } from "./userSlice";
import { Link } from "react-router-dom";

export const UsersList = () => {
  const users = useSelector(selectAllusers);

  const renderedUsers = users.map((user, index) => {
    return (
      <li key={user.id}>
        <Link to={`/user/${user.id}`}>{user.name}</Link>
      </li>
    );
  });

  return (
    <section>
      <h2>Users List</h2>
      <ul>{renderedUsers}</ul>
    </section>
  );
};
