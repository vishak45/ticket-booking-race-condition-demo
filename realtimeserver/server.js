import socket from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = socket(server);

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(6000, () => {
    console.log("listening on *:3000");
});