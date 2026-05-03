import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice"
import chatReducer from "./slice/chatSlice"
const store=configureStore({
    reducer:{
        auth:authReducer,
        chat:chatReducer,
    }
})
export default store