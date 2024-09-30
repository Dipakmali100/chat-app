import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

function GetChat() {
  const { friendId, username } = useSelector((state: any) => state.activeUser);
  const [chat, setChat] = useState([]);
  const { user }:any =useAuth();
  console.log("In GetChat: ",user)
  return (
    <div className="border-2 border-black">
      <h1 className="font-bold">Get Chat</h1>
      <div>Friend Name: {username}</div>
      <div>Friend ID: {friendId}</div>
      <div>My UserId: {user?.userId}</div>
      {chat.map((message: any) => (
        <div key={message.id}>
          
        </div>
      ))}
    </div>
  )
}

export default GetChat;
