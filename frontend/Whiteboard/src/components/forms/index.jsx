import "./index.css";
import Createroomform from "./createroomform";
import Joinroomform from "./joinroomform";
const forms=({uuid,socket,user,setUser})=>{
    return (
        <div className="row h-100 pt-5">
            <div className="col-md-4 mt-5 p-5 form-box border border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold">Create Room</h1>
                <Createroomform uuid={uuid} socket={socket} setUser={setUser}/>
            </div>
            <div className="col-md-4 mt-5 p-5 form-box mx-auto border border-primary rounded-2 d-flex flex-column align-items-center"><h1 className="text-primary fw-bold">Join Room</h1><Joinroomform uuid={uuid} socket={socket} setUser={setUser}/></div>
        </div>
    );
}
export default forms;