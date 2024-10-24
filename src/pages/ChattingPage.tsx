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
import { Button } from '../components/ui/button';

export default function ChattingPage() {
  const { friendId } = useSelector((state: any) => state.activeUser);
  const [activeUsers, setActiveUsers] = useState<any>({});
  const [isDisconnected, setIsDisconnected] = useState(false);
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user }: any = useAuth();
  const userId = user?.userId;

  useEffect(() => {
    if (!socket || !userId) {
      return;
    }

    // console.log("Socket connected: ", socket);

    // Listen for active users updates
    socket.on('alreadyOnlineUsers', (data) => {
      setActiveUsers(data);
      // console.log("Already online users: ", data);
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
      // console.log("Active users: ", activeUsers);
    });

    // Listen for remove active user updates
    socket.on('removeActiveUser', (data) => {
      setActiveUsers((prevUsers: any) => {
        const updatedUsers = { ...prevUsers };
        delete updatedUsers[data.userId];
        return updatedUsers;
      });
      // console.log("Active users: ", activeUsers);
    });

    // Listen for new message
    socket.on('newMessage', () => {
      dispatch(setRefreshFriendList(Math.random()));
    });

    // Listen for disconnect
    socket.on('disconnect', () => {
      // console.log("Disconnected from server");
      setIsDisconnected(true);
    });


    // Clean up on component unmount
    return () => {
      socket.off('alreadyOnlineUsers');
      socket.off('newActiveUser');
      socket.off('removeActiveUser');
      socket.off('newMessage');
      socket.off('disconnect');
    };
  }, [socket, userId]); // Dependency array to re-run when userId changes

  return (
    <div className="flex h-screen bg-black text-white">
      {isDisconnected && (
        <div className="absolute z-50 inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className='bg-red-600 flex w-full md:w-1/2 lg:w-1/3 flex-col items-center rounded-md p-4'>
            <div className='px-4 py-2 text-black text-xl font-bold flex text-center'>
              {/* <MessageCircleWarning />  */}
              {/* <p>Disconnected from Server!</p> */}
              <p>Oops! You've been disconnected.</p>
            </div>
            <div className='text-gray-200 text-lg font-semibold text-center'>
              Please check your internet connection and try again.
            </div>
            <div className='mt-4'>
              <Button
                onClick={() => window.location.reload()} className='bg-black'>Refresh Page</Button>
            </div>
          </div>
        </div>
      )}
      <div className={`w-full md:w-1/3 flex flex-col ${friendId !== 0 ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-4 pt-4 pb-2">
          <Header />
          <SearchView />
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <FriendList activeUsers={activeUsers} />
        </div>
      </div>
      <div className={`w-full md:w-2/3 py-4 md:border-l md:border-gray-700 ${friendId !== 0 ? 'block' : 'hidden md:block'}`}>
        {friendId !== 0 ? <ChatView activeUsers={activeUsers} /> : <ChatPlaceholder />}
      </div>
    </div>
  )
}