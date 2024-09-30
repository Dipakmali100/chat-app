import { useEffect, useState } from 'react'
import { getFriendList } from '../services/operations/ChatAPI';

function GetFriendList() {
    const [friendList, setFriendList] = useState<any>([]);

    useEffect(() => {
        async function fetchData() {
            const response =await getFriendList();
            setFriendList(response.data);
        }
        fetchData();
    },[])
  return (
    <div className='border-2 border-black'>
      <h1 className='font-bold'>Get Friend List</h1>
      {friendList.map((friend: any) => <div key={friend.senderId}><div>
      {friend.senderId} { friend.username}</div><div>Message: {friend.content}</div></div>
    )}
    </div>
  )
}

export default GetFriendList
