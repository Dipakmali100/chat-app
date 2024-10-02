import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchUser from "../components/SearchUser";
import GetFriendList from "../components/GetFriendList";
import GetChat from "../components/GetChat";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

function ChattingPage() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<any>({});
  const { user }: any = useAuth();
  const userId = user?.userId;

  const handleOnClick = () => {
    authContext?.logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!userId) return; // Exit if userId is not available

    const socket = io("http://localhost:3000", {
      query: { userId: userId }, // Pass userId from context
      withCredentials: true,
    });

    // Listen for user status updates
    socket.on('userStatus', (data) => {
      console.log("Active users: ",data.users||{});
      setActiveUsers(data.users||{});
    });

    // Clean up on component unmount
    return () => {
      socket.off('userStatus');
      socket.disconnect(); // Disconnect socket on unmount
    };
  }, [userId]); // Dependency array to re-run when userId changes

  return (
    <>
      <div>
        <SearchUser />
        <GetFriendList />
        <GetChat activeUsers={activeUsers}/>
      </div>
      <div>
        <h2>Online Users</h2>
        <ul>
          {Object.entries(activeUsers).map(([userId, socketId]: any) => (
            <li key={userId}>
              User: {userId}
            </li>
          ))}
        </ul>
      </div>
      <button className="font-bold" onClick={handleOnClick}>Logout</button>
    </>
  );
}

export default ChattingPage;
