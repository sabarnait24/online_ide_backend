const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const { Socket } = require("socket.io");
require('dotenv').config();
app.use(cors());
const path = require('path');

const io = require("socket.io")(http, {
  cors: {

    origin: ["https://code-editor-2ss8.onrender.com"],

  },
});

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/", require("./route"));

// app.use("/",require("./socket"))
const Socketmap = {};

function getAllClients(roomID) {
  return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
    (socketId) => {
      return {
        socketId,
        username: Socketmap[socketId],
      };
    }
  );
}

io.on("connection", (Socket) => {
  Socket.on("join", ({ roomID, username }) => {
    Socketmap[Socket.id] = username;
    Socket.join(roomID);
    const Client = getAllClients(roomID);
    // console.log(Client);
    Client.forEach(({ socketId }) => {
      // console.log(Client);
      io.to(socketId).emit("NewUserJoin", {
        Client,
        username,
        socketId: Socket.id,
      });
    });
    // io.emit("codesync",{value});
    
  });
  Socket.on("disconnect", () => {
    var allRooms = Array.from(io.sockets.adapter.rooms || []);
    // console.log(allRooms);
    allRooms.forEach((roomID) => {
      Socket.in(roomID).emit("UserDisconnected", {
        socketId: Socket.id,
        username: Socketmap[Socket.id],
      });
    });
    delete Socketmap[Socket.id];
    Socket.leave();
  });
  Socket.on("codechange", ({ roomID, value }) => {
    io.emit("codesync",{value});
  });
  Socket.on("inputchange", ({ roomID, inputvalue }) => {
    // console.log(inputvalue);
    io.emit("inputsync",{inputvalue});
  });
  Socket.on("outputchange", ({ roomID, outputvalue }) => {
    // console.log(inputvalue);
    io.emit("outputsync",{outputvalue});
  });
});
if (process.env.NODE_ENV === "production") {
  console.log("In production stage");
  app.use(express.static(path.resolve(__dirname,"../", "client", "build")))
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"../", "client", "build", "index.html"));
  });
}

http.listen(port, () => {
  console.log(`connection is successful at ${port}`);
});
