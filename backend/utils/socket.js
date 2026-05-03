import { Server } from "socket.io";

const userSocketMap = {};
let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      if (!userSocketMap[userId]) {
        userSocketMap[userId] = [];
      }
      userSocketMap[userId].push(socket.id);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      if (userId) {
        userSocketMap[userId] = userSocketMap[userId].filter(
          (id) => id !== socket.id
        );

        if (userSocketMap[userId].length === 0) {
          delete userSocketMap[userId];
        }
      }

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getReciverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };