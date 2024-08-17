import io from "socket.io-client";
import './App.css'
import Forms from './components/forms';
import Roompage from './pages/Roompage';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from "react";
const server="http://localhost:3000";
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
  // useEffect(()=>{
  //   socket.on("userIsJoined",(data)=>{
  //     if(data.success){
  //       console.log("user is joined");
  //       setUser(data.users);
  //     }else{
  //       console.log("Something went wrong");
  //     }
  //   })
  // },[])
  const uuid=()=>{
    let s4=()=>{
      return (((1+Math.random())*0x10000)| 0).toString(16).substring(1);
    };
    return (
s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4()
    );
  }
  return (<div className='container'>
  <Routes>
    <Route path="/" element={<Forms uuid={uuid} socket={socket} user={user} setUser={setUser}/>} />
    <Route path='/:roomid' element={<Roompage user={user} socket={socket} users={users}/>}></Route>
  </Routes>
  </div>);
}

export default App;
