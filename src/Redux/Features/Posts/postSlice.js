import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

// URL for the posts API
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

const postAdopter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// Initial state for the posts slice
const initialState = postAdopter.getInitialState({
  // posts: [], // Array to hold post objects
  status: "idle", // Status of fetch operation: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if fetch fails
  count: 0,
});

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
// Asynchronous thunk action for updating a exsiting post to the API
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POST_URL}/${id}`, initialPost);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);
// Asynchronous thunk action for Delete a post to the API
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POST_URL}/${id}`);
      if (response?.status === 200) return initialPost;
    } catch (error) {
      console.error(error.message);
    }
  }
);
// Creating the posts slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Reducer for adding a reaction to a post
    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount(state, action) {
      state.count = state.count + 1;
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
        // state.posts = state.posts.concat(loadedPosts);
        postAdopter.upsertMany(state, loadedPosts);
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
        // state.posts.push(action.payload);
        postAdopter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        // const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = [...posts, action.payload];
        postAdopter.upsertMany(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = posts;
        postAdopter.removeOne(state, id);
      });
  },
});

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postAdopter.getSelectors((state) => state.posts);

// Selector for getting all posts
// export const selectAllPosts = (state) => state.posts.posts;
// Selector for getting the status of posts
export const getPostsStatus = (state) => state.posts.status;
// Selector for getting any error related to posts
export const getPostsError = (state) => state.posts.error;
// Selecotor for getting count
export const getCount = (state) => state.posts.count;
// Selector for getting required post by using userid to get particular post
// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);
// Exporting the reducer
export const postReducer = postSlice.reducer;
// Exporting actions
export const { reactionAdded, increaseCount } = postSlice.actions;
