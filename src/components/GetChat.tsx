import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { getChat, sendMessage } from "../services/operations/ChatAPI";
import { setRefreshFriendList } from "../redux/slice/eventSlice";
import { useSocket } from "../context/SocketContext";
import { randomInRange } from "@tsparticles/engine";

function GetChat({ activeUsers }: any) {
  // const { refreshFriendList } = useSelector((state: any) => state.event);
  const { friendId, username } = useSelector((state: any) => state.activeUser);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const { user }: any = useAuth();
  const socket = useSocket();
  const dispatch = useDispatch();
  async function fetchData() {
    const response = await getChat(friendId);
    setChat(response.data);
  }
  async function handleMessageSubmit(e: any) {
    e.preventDefault();
    const response = await sendMessage(friendId, message);
    if (response.success) {
      await fetchData();
      setMessage("");
      dispatch(setRefreshFriendList(Math.random()));
      socket?.emit("sendMessage", { senderId: user?.userId, receiverId: friendId, content: message });
    } else {
      alert(response.message);
    }
  }

  useEffect(() => {
    if (!socket) {
      console.log("Socket not found");
      return;
    }

    const handleNewMessage = async (data: any) => {
      console.log("New Message From FriendId: ", data.senderId);
      if (Number(data.senderId) === Number(friendId)) {
        handler(); // Fetch new chat data on receiving a new message
      } else {
        dispatch(setRefreshFriendList(Math.random())); // This toggles the state
      }
    };


    // Define the handler function here
    const handler = async () => {
      if (friendId) { // Ensure friendId is defined before fetching
        await fetchData();
        dispatch(setRefreshFriendList(Math.random()));
      }
    };

    // Call handler initially
    handler();

    // Set up the socket listener
    socket.on("newMessage", handleNewMessage);

    // Cleanup function
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [friendId, username, socket]);

  return (
    <div className="border-2 border-black">
      <h1 className="font-bold">Chat Header</h1>
      <div>Friend Name: {username === "" ? "Not Selected" : username}</div>
      <div>Friend ID: {friendId === 0 ? "Not Selected" : friendId}</div>
      <div>Friend Status: {activeUsers[friendId] ? "Online" : "Offline"}</div>
      <div>My UserId: {user?.userId}</div>
      <div className="font-bold">Conversation</div>
      <div className=" border-2 border-black w-[500px]">
        {chat.map((message: any) => (
          (message.senderId === user?.userId) ? (
            <div className="border-2 border-black" key={message.id}>
              <div className="text-right">You: {message.content}</div>
            </div>
          ) : (
            <div className="border-2 border-black" key={message.id}>
              <div className="text-left">Friend: {message.content}</div>
            </div>
          )
        ))
        }
        <div>
          <form className="flex" onSubmit={handleMessageSubmit}>
            <input type="text" placeholder="Enter message" value={message} className="w-4/6 border-2 border-black" onChange={(e) => setMessage(e.target.value)} />
            <button type="submit" className="w-2/6 border-2 border-black">Send</button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default GetChat;
