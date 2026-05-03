import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// GET USERS
export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/message/user");
      return res.data.users;
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch users");
      return thunkAPI.rejectWithValue(e.response?.data?.message);
    }
  }
);

// GET MESSAGES
export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (userId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      return res.data.messages;
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.message);
      return thunkAPI.rejectWithValue(e.response?.data?.message);
    }
  }
);

// SEND MESSAGE
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, thunkAPI) => {
    try {
      const { chat } = thunkAPI.getState();

      const res = await axiosInstance.post(
        `/message/sent/${chat.selectedUser._id}`,
        messageData
      );

      return res.data;
    } catch (e) {
      console.log("Error:", e);
      toast.error(e.response?.data?.message);
      return thunkAPI.rejectWithValue(e.response?.data?.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    pushNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // USERS
      .addCase(getUsers.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUserLoading = false;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isUserLoading = false;
      })

      // MESSAGES
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isMessagesLoading = false;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })

      // SEND MESSAGE
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload.newMessage);
      });
  },
});

export const { setSelectedUser, pushNewMessage } = chatSlice.actions;
export default chatSlice.reducer;