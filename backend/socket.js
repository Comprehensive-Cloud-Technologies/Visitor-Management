import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {

  io = new Server(server, {

    cors: {
      origin: "http://localhost:5173",
      methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE"
      ]
    }

  });

  return io;

};

export const getIO = () => io;