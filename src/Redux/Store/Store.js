import { configureStore } from "@reduxjs/toolkit";
import { postReducer } from "../Features/Posts/postSlice";
import { userReducer } from "../Features/User/userSlice";

const store = configureStore({
  reducer: {
    posts: postReducer,
    users: userReducer,
  },
});

export { store };
