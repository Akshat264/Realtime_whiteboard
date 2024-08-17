import Whiteboard from "../../components/whiteboard";
import "./index.css";
import {useRef, useState , useEffect} from "react";
const Roompage=({user,socket,users})=>{
    const canvasRef = useRef(null);
    const ctxRef= useRef(null);
    const [tool,setTool]=useState("pencil");
    const [color,setColor]=useState("black");
    const [elements,setElements] =useState([]);
    const [history,setHistory]= useState([]);
    useEffect(() => {
        console.log('Is presenter:', user?.presenter);
    }, [user]);
    const handleClearCanvas=()=>{
        const canvas=canvasRef.current;
        const ctx=canvas.getContext('2d');
        ctx.FILLRect="White";
        ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        setElements([]);
    }
    const undo=()=>{
        setHistory((prevhistory)=>[...prevhistory, elements[elements.length-1]]);
        setElements((prevele)=> prevele.slice(0,prevele.length-1));
    }
    const redo=()=>{
        setElements((prevele)=>[
            ...prevele,
            history[history.length-1],
        ]);
        setHistory((prevhistory)=>prevhistory.slice(0,prevhistory.length-1));
    }
    return (
        <div className="row d-flex justify-content-center">
            <h1 className="text-center py-4">White Board Sharing App <span className="text-primary">[Students Online: {users.length}]</span></h1>
            {user?.presenter && <div className="col-md-10 gap-2 mt-4 mb-5 d-flex align-items-center justify-content-center mx-auto">
             <div className="d-flex col-md-4 justify-content-between gap-1">
                <div className="d-flex gap-1 align-items-center">
                    <label htmlFor="pencil">Pencil</label>
                    <input type="radio" checked={tool === "pencil"} id="pencil" name="tool" value="pencil" onChange={(e)=>setTool(e.target.value)}/>
                </div>
                <div className="d-flex gap-1 align-items-center">
                    <label htmlFor="line">Line</label>
                    <input type="radio" checked = {tool==="line"} id="line" name="tool" value="line" onChange={(e)=>setTool("line")}/>
                </div>
                <div className="d-flex gap-1 align-items-center">
                    <label htmlFor="rect">Rectangle</label>
                    <input type="radio" checked={tool==="rect"} id="rect" name="tool" value="rect" onChange={(e)=>setTool("rect")}/>
                </div>
             </div>
             <div className="col-md-2 mx-auto">
                <div className="d-flex align-items-center">
                    <label htmlFor="color">Change Color:</label>
                    <input type="color" id="color" className="mt-1 ms-1" value={color} onChange={(e)=>setColor(e.target.value)}/>
                </div>
            </div>
            <div className="col-md-3 d-flex gap-2">
                <button className="btn btn-primary mt-1" disabled={elements.length===0} onClick={()=>undo()}>Undo</button>
                <button className="btn btn-outline-primary mt-1" disabled={history.length<1} onClick={()=>redo()}>Redo</button>
            </div>
            <div className="col-md-2">
                <button className="btn btn-danger" onClick={handleClearCanvas}>Clear Canvas</button>
            </div>
            </div>}
            <div className="col-md-10 canvas-box mx-auto">
                     <Whiteboard canvasRef={canvasRef} ctxRef={ctxRef} elements={elements} setElements={setElements} tool={tool} setTool={setTool} color={color} user={user} socket={socket}/>
            </div>
        </div>
    )
}
export default Roompage;