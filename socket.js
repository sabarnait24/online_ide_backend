const express = require("express");
const { Socket } = require("socket.io");
const app = express();
const http = require('http').Server(app);
const io=require("socket.io")(http);

io.on('connection',Socket=>{
    console.log(Socket.id);
})

const Socketmap={};

// const getAllClinets = (roomID)=>{
//     const clients=io.socket.adapter.rooms.get(roomID) || [];
//     console.log(clients);
// }



// getAllClinets();