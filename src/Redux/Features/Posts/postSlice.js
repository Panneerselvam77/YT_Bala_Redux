import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

// URL for the posts API
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

// Initial state for the posts slice
const initialState = {
  posts: [], // Array to hold post objects
  status: "idle", // Status of fetch operation: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if fetch fails
};

// Asynchronous thunk action for fetching posts from the API
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POST_URL);
  return response.data;
});

// Asynchronous thunk action for adding a new post to the API
export const addNewPost = createAsyncThunk(
  "posts/addNewPosts",
  async (initialPost) => {
    const response = await axios.post(POST_URL, initialPost);
    return response.data;
  }
);

// Creating the posts slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Reducer for adding a post
    postAdded: {
      reducer: (state, action) => {
        state.posts.push(action.payload);
      },
      prepare: (title, content, userId) => {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    // Reducer for adding a reaction to a post
    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      // Handle pending state for fetching posts
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      // Handle fulfilled state for fetching posts
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        state.posts = state.posts.concat(loadedPosts);
      })
      // Handle rejected state for fetching posts
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle fulfilled state for adding a new post
      .addCase(addNewPost.fulfilled, (state, action) => {
        const sortedPosts = state.posts.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          hooray: 0,
          heart: 0,
          rocket: 0,
          eyes: 0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      });
  },
});

// Selector for getting all posts
export const selectAllPosts = (state) => state.posts.posts;
// Selector for getting the status of posts
export const getPostsStatus = (state) => state.posts.status;
// Selector for getting any error related to posts
export const getPostsError = (state) => state.posts.error;
// Selector for getting required post by using userid to get particular post
export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);
// Exporting the reducer
export const postReducer = postSlice.reducer;
// Exporting actions
export const { postAdded, reactionAdded } = postSlice.actions;
