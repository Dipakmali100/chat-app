import { useState } from 'react';
import ChatPlaceholder from '../components/ChattingPage/ChatPlaceholder';
import ChatView from '../components/ChattingPage/ChatView';
import FriendList from '../components/ChattingPage/FriendList';
import Header from '../components/ChattingPage/Header';
import SearchView from '../components/ChattingPage/SearchView';

type Friend = {
  id: number;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
}

export default function NewChattingPage() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  return (
    <div className="flex h-screen bg-black text-white">
      <div className={`w-full md:w-1/3 flex flex-col ${selectedFriend ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-4 pt-4">
          <Header />
          <SearchView />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <FriendList setSelectedFriend={setSelectedFriend} />
        </div>
      </div>
      <div className={`w-full md:w-2/3 p-4 md:border-l md:border-gray-700 ${selectedFriend ? 'block' : 'hidden md:block'}`}>
        {selectedFriend ? <ChatView selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} /> : <ChatPlaceholder />}
      </div>
    </div>
  )
}