import io from "socket.io-client";
import './App.css'
import Forms from './components/forms';
import Roompage from './pages/Roompage';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from "react";
import {toast, ToastContainer} from "react-toastify";
const server="https://realtime-whiteboard-1-tf9l.onrender.com/";
const connectionOptions={
  "force neww connction" : true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
}
const socket= io(server,connectionOptions);
function App() {
  const [user,setUser]=useState(null);
  const [users,setUsers]=useState([]);
  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        console.log("user is joined");
        setUsers(data.users);
      }else{
        console.log("Something went wrong");
      }
    })
    socket.on("allUsers",(data)=>{
      setUsers(data);
    })
    socket.on("userJoinedMessage",(data)=>{
      toast.info(`${data} joined the room`);
    })
    socket.on("userLeftMessage",(data)=>{
      toast.info(`${data} left the room`);
    })
  },[])

  const uuid=()=>{
    let s4=()=>{
      return (((1+Math.random())*0x10000)| 0).toString(16).substring(1);
    };
    return (
s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4()
    );
  }
  return (<div className='container'>
    <ToastContainer/>
  <Routes>
    <Route path="/" element={<Forms uuid={uuid} socket={socket} user={user} setUser={setUser}/>} />
    <Route path='/:roomid' element={<Roompage user={user} socket={socket} users={users}/>}></Route>
  </Routes>
  </div>);
}

export default App;
