const express= require("express");
const app= express();
const cors=require("cors");
const server= require("http").createServer(app);
const {Server} = require("socket.io");
const io=new Server(server);
const { addUser } = require('./utils/users');
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Hello");
})
let roomId,imgURL;
io.on("connection", (socket)=>{
   socket.on("userJoined",(data)=>{
    const {name, userId, roomid, host, presenter}=data;
    roomId=roomid;
    socket.join(roomid);
    const users=addUser(data);
    socket.emit("userIsJoined",{success: true,users});
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{imgURL: data,});
   })
   socket.on("WhiteboardData",(data)=>{
       imgURL=data;
       socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{ imgURL: data,});
   });
});
const port= process.env.PORT || 3000;
server.listen(port,()=>console.log("Server is running on http://localhost:3000"));