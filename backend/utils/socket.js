import { Server } from "socket.io";

const userSocketMap = {};

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://talk-loop-iota.vercel.app",
      ],
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId?.toString();

    console.log("USER ID:", userId);

    if (userId) {
      if (!userSocketMap[userId]) {
        userSocketMap[userId] = [];
      }

      // prevent duplicate socket ids
      if (!userSocketMap[userId].includes(socket.id)) {
        userSocketMap[userId].push(socket.id);
      }
    }

    // send updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      if (userId && userSocketMap[userId]) {
        userSocketMap[userId] = userSocketMap[userId].filter(
          (id) => id !== socket.id
        );

        // remove user if no sockets left
        if (userSocketMap[userId].length === 0) {
          delete userSocketMap[userId];
        }
      }

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getReciverSocketId(userId) {
  return userSocketMap[userId] || [];
}

export { io };