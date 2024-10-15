import ChatPlaceholder from '../components/ChattingPage/ChatPlaceholder';
import ChatView from '../components/ChattingPage/ChatView';
import FriendList from '../components/ChattingPage/FriendList';
import Header from '../components/ChattingPage/Header';
import SearchView from '../components/ChattingPage/SearchView';
import { useSelector } from 'react-redux';

export default function NewChattingPage() {
  const { friendId } = useSelector((state: any) => state.activeUser);

  return (
    <div className="flex h-screen bg-black text-white">
      <div className={`w-full md:w-1/3 flex flex-col ${friendId !== 0 ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-4 pt-4">
          <Header />
          <SearchView />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <FriendList />
        </div>
      </div>
      <div className={`w-full md:w-2/3 p-4 md:border-l md:border-gray-700 ${friendId !== 0 ? 'block' : 'hidden md:block'}`}>
        {friendId !== 0 ? <ChatView /> : <ChatPlaceholder />}
      </div>
    </div>
  )
}