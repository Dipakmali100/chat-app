import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchUser from "../components/SearchUser";
import GetFriendList from "../components/GetFriendList";
import GetChat from "../components/GetChat";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

function ChattingPage() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<any>({});
  const socket = useSocket();
  const { user }: any = useAuth();
  const userId = user?.userId;

  const handleOnClick = () => {
    authContext?.logout();
    navigate("/login");
  };
  
  useEffect(() => {
    if (!socket || !userId){
      console.log("Socket or userId not found");
      return;
    }
    console.log("Socket and userId found");

    // Listen for active users updates
    socket.on('alreadyOnlineUsers', (data) => {
      setActiveUsers(data);
      console.log("Already online users: ", data);
    });

    // Listen for new active user updates
    socket.on('newActiveUser', (data) => {
      setActiveUsers((prevUsers:any) => ({
        ...prevUsers,
        [data.userId]: data.socketId // Correctly spread the previous users and update with new user
      }));
      console.log("Active users: ", activeUsers);
    });

    // Listen for remove active user updates
    socket.on('removeActiveUser', (data) => {
      setActiveUsers((prevUsers:any) => {
        const updatedUsers = { ...prevUsers };
        delete updatedUsers[data.userId];
        return updatedUsers;
      });
      console.log("Active users: ", activeUsers);
    });

    // Clean up on component unmount
    return () => {
      socket.off('alreadyOnlineUsers');
      socket.off('newActiveUser');
      socket.off('removeActiveUser');
    };
  }, [socket, userId]); // Dependency array to re-run when userId changes

  return (
    <>
      <div>
        <SearchUser />
        <GetFriendList />
        <GetChat activeUsers={activeUsers} />
      </div>
      <div>
        <h2>Online Users</h2>
        <ul>
          {Object.entries(activeUsers).map(([userId]: any) => (
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
