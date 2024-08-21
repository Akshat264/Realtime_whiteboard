import { useState } from "react";
import { useNavigate } from "react-router-dom";
const createroomform=({uuid,socket,setUser})=>{
    const [roomId,setRoomid]=useState(uuid());
    const [name,setName]=useState("");
    const navigate= useNavigate();
    const handleCreateroom=(e)=>{
        e.preventDefault();
        // name,roomid, uuid, host, presenter
        const roomData={
            name,
            roomId,
            userId: uuid(),
            host: true,
            presenter: true,
        }
        setUser(roomData);
        navigate(`${roomId}`);
        console.log(roomData);
        socket.emit("userJoined",roomData);
    }
    const copyToClipboard = () => {
        const textarea = document.createElement("textarea");
        textarea.value = roomId;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("RoomId copied to clipboard!");
      };
return (
    <form className="form col-md-12 mt-5">
        <div className="form-group">
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)}className="form-control my-2" placeholder="Enter your name"/>
        </div>
        <div className="form-group border">
              <div className="input-group d-flex align-items-center justify-content-center">
                <input type="text" value={roomId}className="form-control my-2 border-0" disabled placeholder="Generate room id"/>
                <div className="input-group-append d-flex gap-1">
                    <button className="btn btn-primary btn-sm me-1" onClick={()=>setRoomid(uuid())} type="button">Generate</button>
                    <button className="btn btn-outline-danger btn-sm" type="button" onClick={copyToClipboard}>Copy</button>
                </div>
              </div>
              </div>
        <button type="submit" onClick={(e)=>handleCreateroom(e)} className="mt-4 btn-primary btn form-control">Generate Room</button>
    </form>
);
}
export default createroomform;