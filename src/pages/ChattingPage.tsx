import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchUser from "../components/SearchUser";
import GetFriendList from "../components/GetFriendList";
import GetChat from "../components/GetChat";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { toast } from "../hooks/use-toast";

function ChattingPage() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<any>({});
  const socket = useSocket();
  const { user }: any = useAuth();
  const userId = user?.userId;

  const handleOnClick = () => {
    authContext?.logout();
    navigate("/auth");
    toast({
      title: "You are logged out"
    })
  };

  useEffect(() => {
    if (!socket || !userId) {
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
      setActiveUsers((prevUsers: any) => ({
        ...prevUsers,
        [data.userId]: data.socketId // Correctly spread the previous users and update with new user
      }));
      console.log("Active users: ", activeUsers);
    });

    // Listen for remove active user updates
    socket.on('removeActiveUser', (data) => {
      setActiveUsers((prevUsers: any) => {
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
      <div className="flex h-screen w-screen bg-black text-white">
        <div className="w-1/3 border-r-2 border-white">
          <SearchUser />
          <GetFriendList />
        </div>
        <div className="w-2/3">
          <GetChat activeUsers={activeUsers} />
        </div>
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
