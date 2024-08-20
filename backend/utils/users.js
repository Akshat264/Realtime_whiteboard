const users=[];
//Add a user to the list
const addUser=({name,userId,roomId,host,presenter,socketId})=>{
    const user={name,userId,roomId,host,presenter,socketId};
    console.log(user);
    users.push(user);
    return users.filter((user)=>user.roomId===roomId);
}
const removeUser=(id)=>{
    const index=users.findIndex(user=>user.socketId===id);
    if(index!==-1){ 
        return users.splice(index,1)[0];
    }
};

const getUser=(id)=>{
  return users.find((user)=>user.socketId===id);
}
const getUsersInRoom=(roomId)=>{
    return users.filter((user)=>user.roomId===roomId);
};
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}