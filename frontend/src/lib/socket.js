import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (user) => {
  // extract actual id safely
  const userId =
    typeof user === "object" ? user?._id : user;

  if (!userId) {
    console.warn("Skip socket: userId not ready");
    return null;
  }

  // already connected
  if (socket?.connected) {
    return socket;
  }

  const URL =
    import.meta.env.VITE_SOCKET_URL ||
    "http://localhost:3000";

  socket = io(URL, {
    query: {
      userId: String(userId),
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log(" Connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log(" Disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error(" Socket error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};