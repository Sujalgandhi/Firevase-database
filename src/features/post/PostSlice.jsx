import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../../Api/apiInstance";

const initialState = {
  post: [],
  error: null,
  loading: false,
};

// Create Post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (newPost, { rejectWithValue }) => {
    try {
      const res = await apiInstance.post("/.json", newPost);
      return { id: res.data.name, ...newPost };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Posts
export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/.json");
      return Object.keys(res.data || {}).map((key) => ({
        id: key,
        ...res.data[key],
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await apiInstance.delete(`/${id}.json`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Edit Post
export const editPost = createAsyncThunk(
  "posts/editPost",
  async (updatedPost, { rejectWithValue }) => {
    try {
      await apiInstance.put(`/${updatedPost.id}.json`, updatedPost);
      return updatedPost;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Post Slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });
  },
});

export default postSlice.reducer;
