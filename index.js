const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const { Socket } = require("socket.io");
require("dotenv").config();
app.use(cors());
const path = require("path");

const io = require("socket.io")(http, {
  cors: {
    origin: ["https://online-ide-frontend.vercel.app/"],
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
    console.log(Socketmap);
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
    console.log(Socketmap);
    Socket.leave();
  });
  Socket.on("codechange", ({ roomID, value }) => {
    // console.log(roomID,value);
    // io.in(roomID).emit("codesync", value);
    // Socket.to(roomID).emit("codesync", value);
    // io.emit("codesync", { value });
    // var allRooms = Array.from(io.sockets.adapter.rooms || []);
    // allRooms.forEach((roomID) => {
    // console.log(roomID);
    console.log(Socketmap);
    const Client = getAllClients(roomID);
    // console.log(Client);
    Client.forEach(({ socketId }) => {
      console.log(socketId, value);
      io.to(socketId).emit("codesync", {
        value,
      });
    });

    // });
  });
  Socket.on("inputchange", ({ roomID, inputvalue }) => {
    var allRooms = Array.from(io.sockets.adapter.rooms || []);
    allRooms.forEach((roomID) => {
      Socket.in(roomID).emit("inputsync", {
        socketId: Socket.id,

        inputvalue,
      });
    });
    // io.to(roomID).emit("inputsync", { inputvalue });
  });
  Socket.on("outputchange", ({ roomID, outputvalue }) => {
    // console.log(inputvalue);
    io.emit("outputsync", { outputvalue });
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
