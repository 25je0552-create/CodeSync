import { io } from "socket.io-client";

const battleSocket = io(
    "http://localhost:5000"
);

export default battleSocket;