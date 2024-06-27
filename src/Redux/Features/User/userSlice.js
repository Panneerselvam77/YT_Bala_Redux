import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USER_URL = "https://jsonplaceholder.typicode.com/users";

const initialState = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(USER_URL);
  return response.data;
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectAllusers = (state) => state.users;
export const selectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId);

export const userReducer = userSlice.reducer;
