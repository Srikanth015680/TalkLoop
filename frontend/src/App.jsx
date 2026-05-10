import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser, setOnlineUser } from "./store/slice/authSlice";
import { connectSocket } from "./lib/socket";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Fetch user on load
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // STABLE SOCKET CONNECTION (NO DISCONNECT BUG)
  useEffect(() => {
    if (!authUser?._id) return;

    const socket = connectSocket(authUser._id);
    if (!socket) return;

    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUser(users));
    });

    return () => {
      socket.off("getOnlineUsers"); 
    };
  }, [authUser?._id, dispatch]);

  // Loading
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />

          <Route
            path="/register"
            element={!authUser ? <Register /> : <Navigate to="/" />}
          />

          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;