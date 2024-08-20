const express= require("express");
const app= express();
const cors=require("cors");
const server= require("http").createServer(app);
const {Server} = require("socket.io");
const io=new Server(server);
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Hello");
})
let roomIdGlobal,imgURLGlobal;
io.on("connection", (socket)=>{
   socket.on("userJoined",(data)=>{
    console.log("userjoined", data.name);
    const {name, userId, roomid, host, presenter}=data;
    roomIdGlobal=roomid;
    socket.join(roomid);
    const users=addUser({name,userId,roomid,host,presenter,socketId: socket.id});
    socket.emit("userIsJoined",{success: true,users});
    socket.broadcast.to(roomIdGlobal).emit("userJoinedMessage",name);
    socket.broadcast.to(roomIdGlobal).emit("allUsers",users);
    socket.broadcast.to(roomid).emit("whiteBoardDataResponse",{imgURL: imgURLGlobal,});
   })
   socket.on("WhiteboardData",(data)=>{
       imgURL=data;
       socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse",{ imgURL: data,});
   });
   socket.on("message", (data)=>{
    const {message}=data;
    const user=getUser(socket.id);
    if(user){
        socket.broadcast.to(roomIdGlobal).emit("messageResponse",{message,name: user.name});
    }
   })
   socket.on("disconnect",()=>{
    const user=getUser(socket.id);
    if(user){
        removeUser(socket.id);
        const users=getUsersInRoom(user.roomId);
        socket.emit("userIsJoined",{success: true,users});
        socket.broadcast.to(roomIdGlobal).emit("allUsers",users);
        socket.broadcast.to(roomIdGlobal).emit("userLeftMessage",user.name);
    }
   })
});
const port= process.env.PORT || 3000;
server.listen(port,()=>console.log("Server is running on http://localhost:3000"));