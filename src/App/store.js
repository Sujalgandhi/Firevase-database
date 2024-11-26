import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../features/post/PostSlice";

const store = configureStore({
    reducer: {
        post : postReducer,
    }
})

export default store;