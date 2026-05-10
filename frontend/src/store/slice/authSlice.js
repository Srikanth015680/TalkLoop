import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";

// ================= GET CURRENT USER =================
export const getUser = createAsyncThunk(
  "user/me",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/user/me");

      // connect socket after auth success
      connectSocket(res.data.user);

      return res.data.user;
    } catch (e) {
      console.log("Error fetching user:", e);

      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// ================= LOGOUT =================
export const logout = createAsyncThunk(
  "user/sign-out",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.get("/user/sign-out");

      disconnectSocket();

      return null;
    } catch (e) {
      toast.error(e.response?.data?.message);

      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Logout failed"
      );
    }
  }
);

// ================= LOGIN =================
export const login = createAsyncThunk(
  "user/sign-in",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/user/sign-in",
        data
      );

      connectSocket(response.data.user);

      toast.success("Logged in successfully");

      return response.data.user;
    } catch (e) {
      toast.error(e.response?.data?.message);

      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Login failed"
      );
    }
  }
);

// ================= SIGNUP =================
export const signup = createAsyncThunk(
  "user/sign-up",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/user/sign-up",
        data
      );

      // FIXED
      connectSocket(res.data.user);

      toast.success("Account created successfully");

      return res.data.user;
    } catch (e) {
      toast.error(e.response?.data?.message);

      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Signup failed"
      );
    }
  }
);

// ================= UPDATE PROFILE =================
export const updateProfile = createAsyncThunk(
  "user/update-profile",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        "/user/update-profile",
        data
      );

      toast.success("Profile updated successfully");

      return res.data.user || res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",

  initialState: {
    authUser: null,
    isSignUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
  },

  reducers: {
    setOnlineUser(state, action) {
      state.onlineUsers = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===== GET USER =====
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })

      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      // ===== LOGOUT =====
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })

      // ===== LOGIN =====
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })

      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // ===== SIGNUP =====
      .addCase(signup.pending, (state) => {
        state.isSignUp = true;
      })

      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isSignUp = false;
      })

      .addCase(signup.rejected, (state) => {
        state.isSignUp = false;
      })

      // ===== UPDATE PROFILE =====
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload;

        // FIXED
        state.isUpdatingProfile = false;
      })

      .addCase(updateProfile.rejected, (state) => {

        // FIXED
        state.isUpdatingProfile = false;
      });
  },
});

export const { setOnlineUser } = authSlice.actions;

export default authSlice.reducer;