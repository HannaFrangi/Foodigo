import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket) {
    // Assuming you have a server running on localhost or adjust the URL
    socket = io("http://localhost:5000", {
      query: { userId }, // Passing the userId to the server to initialize the socket for the user
    });

    socket.on("connect", () => {
      console.log(`Socket connected with ID: ${socket.id}`);
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
    socket = null;
  }
};
