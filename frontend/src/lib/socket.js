import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!userId) {
    console.warn("Skip socket: userId not ready");
    return null;
  }

  if (socket?.connected) return socket;

  const URL =
    import.meta.env.VITE_SOCKET_URL ||
    "https://talk-loop-backend.vercel.app";

  socket = io(URL, {
    query: { userId },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message);
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