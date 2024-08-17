import { useState } from "react";
import { useNavigate } from "react-router-dom";
const joinroomform=({uuid,socket,setUser})=>{
    const [roomid,setRoomid] = useState("");
    const [name,setName]=useState("");
    const navigate=useNavigate();
    const handlejoinroom=(e)=>{
        e.preventDefault();
        const roomData={
            name,
            roomid,
            userId: uuid(),
            host: false,
            presenter: false,
        }
        setUser(roomData);
        navigate(`${roomid}`);
        socket.emit("userJoined",roomData);
    }
    return ( <form className="form col-md-12 mt-5">
        <div className="form-group">
            <input type="text" className="form-control my-2" onChange={(e)=>setName(e.target.value)} placeholder="Enter your name"/>
        </div>
        <div className="form-group">
                <input type="text" className="form-control my-2 border-0" onChange={(e)=>setRoomid(e.target.value)} placeholder="Enter room id"/>
         </div>
        <button type="submit" onClick={(e)=>handlejoinroom(e)} className="mt-4 btn-primary btn form-control">Join Room</button>
    </form>);
    }
    export default joinroomform;