import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
    autoConnect: false, // we'll connect manually once we know the room + role
});