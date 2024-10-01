import { useEffect, useState } from 'react'
import { getFriendList } from '../services/operations/ChatAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../redux/slice/activeUserSlice';

function GetFriendList() {
  const { refreshFriendList } = useSelector((state: any) => state.event);
  const [friendList, setFriendList] = useState<any>([]);
  const dispatch = useDispatch();

  async function fetchData() {
    const response = await getFriendList();
    setFriendList(response.data);
  }
  useEffect(() => {
    fetchData();
    console.log("Refresh friend list: ", refreshFriendList);
  }, [refreshFriendList]);

  return (
    <div className='border-2 border-black'>
      <h1 className='font-bold'>Friend List</h1>
      {friendList.map((friend: any) =>
        <div key={friend.senderId} className='border-2 border-b-slate-400 cursor-pointer' onClick={() => dispatch(setActiveUser({ friendId: friend.senderId, username: friend.username }))}>
          <div>
            {friend.senderId} {friend.username}
          </div>
          <div>Message: {friend.content}</div>
          <div>Pending: {friend.pendingMessages}</div>
        </div>
      )}
    </div>
  )
}

export default GetFriendList
