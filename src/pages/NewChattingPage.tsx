import ChatPlaceholder from '../components/ChattingPage/ChatPlaceholder';
import ChatView from '../components/ChattingPage/ChatView';
import FriendList from '../components/ChattingPage/FriendList';
import Header from '../components/ChattingPage/Header';
import SearchView from '../components/ChattingPage/SearchView';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { setRefreshChat, setRefreshFriendList } from '../redux/slice/eventSlice';

export default function NewChattingPage() {
  const { friendId } = useSelector((state: any) => state.activeUser);
  const [activeUsers, setActiveUsers] = useState<any>({});
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user }: any = useAuth();
  const userId = user?.userId;

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

      // Refresh friend list due to new active user for latest msg status
      dispatch(setRefreshFriendList(Math.random()));
      dispatch(setRefreshChat(parseInt(data.userId) + Math.random()));
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

    // Listen for new message
    socket.on('newMessage', () => {
      dispatch(setRefreshFriendList(Math.random()));
    });

    // Clean up on component unmount
    return () => {
      socket.off('alreadyOnlineUsers');
      socket.off('newActiveUser');
      socket.off('removeActiveUser');
      socket.off('newMessage');
    };
  }, [socket, userId]); // Dependency array to re-run when userId changes

  return (
    <div className="flex h-screen bg-black text-white">
      <div className={`w-full md:w-1/3 flex flex-col ${friendId !== 0 ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-4 pt-4 pb-2">
          <Header />
          <SearchView />
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <FriendList />
        </div>
      </div>
      <div className={`w-full md:w-2/3 py-4 md:border-l md:border-gray-700 ${friendId !== 0 ? 'block' : 'hidden md:block'}`}>
        {friendId !== 0 ? <ChatView activeUsers={activeUsers}/> : <ChatPlaceholder />}
      </div>
    </div>
  )
}