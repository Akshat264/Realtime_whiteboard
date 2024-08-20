import { useEffect, useState } from "react";

const Chat=({setOpenedChatTab,socket,chat, setChat})=>{
    const [isfocused,setIsFocused]= useState(false);
    const [message,setMessage]=useState("");
    useEffect(()=>{
         socket.on("messageResponse", (data)=>{
            setChat((prevchats)=>[...prevchats,data]);
         })
    },[]);
    const handlesubmit=(e)=>{
        e.preventDefault();
        if(message.trim()!==""){
        socket.emit("message",{message});
        setChat((prevchats)=>[...prevchats,{message,name: "You"}]);
        setMessage("");
        }
    }
    return <div className="position-fixed top-0 h-100 text-white bg-dark" style={{width: "400px", left: "0%"}}>
    <button type="button" className="btn btn-light btn-block w-100 mt-5" onClick={()=>setOpenedChatTab(false)}>Close</button>
    <div className="w-100 mt-5 p-2 border border-1 border-white rounded-3" style={{height: "65%"}}>
        {
            chat.map((msg,index)=>(
                <p key={index*999} className="my-2 text-center w-100">{msg.name}: {msg.message}</p>
            ))
        }
    </div>
    <form onSubmit={handlesubmit}className="w-100 mt-2 border border-1 d-flex border-white rounded-3">
        <input type="text" placeholder="Enter message" className="h-100 py-2 px-2 border-0 rounded-0" onFocus={()=>setIsFocused(true)} onBlur={()=>setIsFocused(false)} style={{backgroundColor: "transparent", width: "100%", color: "white", outline: isfocused && "none"}} value={message} onChange={(e)=>setMessage(e.target.value)}/>
        <button className="btn btn-light btn-block w-50" type="submit">Send</button>
    </form>
</div>
};
export default Chat;