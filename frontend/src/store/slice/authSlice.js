import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";

export const getUser = createAsyncThunk("user/me", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/user/me");

    connectSocket(res.data.user);

    return res.data.user;
  } catch (e) {
    console.log("Error fetching user:", e);
    return thunkAPI.rejectWithValue(
      e.response?.data || "Failed to fetch user"
    );
  }
});

export const logout = createAsyncThunk(
  "user/sign-out",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.get("/user/sign-out");
      disconnectSocket();
      return null;
    } catch (e) {
      toast.error(e.response.data.message);
      return thunkAPI.rejectWithValue(e.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "user/sign-in",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/user/sign-in", data);

      connectSocket(response.data.user); 

      toast.success("Logged in Sucessfully");

      return response.data.user; 
    } catch (e) {
      toast.error(e.response.data.message);
      return thunkAPI.rejectWithValue(e.response.data.message);
    }
  }
);


export const signup = createAsyncThunk(
  "user/sign-up",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/sign-up", data);

      connectSocket(res.data);

      toast.success("Account created successfully");

      return res.data; 
    } catch (e) {
      toast.error(e.response.data.message);
      return thunkAPI.rejectWithValue(e.response.data.message);
    }
  }
);



export const updateProfile = createAsyncThunk(
  "user/update-profile",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);



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
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.authUser = state.authUser;
      })
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

      .addCase(updateProfile.pending, (state) => {
  state.isUpdatingProfile = true;
})
.addCase(updateProfile.fulfilled, (state, action) => {
  state.authUser = action.payload; 
  state.updateProfile = false;
})
.addCase(updateProfile.rejected, (state) => {
  state.updateProfile = false;
})
      
  },
});

export const { setOnlineUser } = authSlice.actions;
export default authSlice.reducer;