import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Send, ArrowLeft } from "lucide-react"

type Friend = {
  id: number;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
}

export default function NewChattingPage() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const friends: Friend[] = [
    { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
  ]

  const FriendList = () => (
    <div className="w-full md:w-1/3 flex flex-col h-full px-4 md:pr-4">
      <h1 className="text-2xl font-bold mb-4">ChatNow</h1>
      <Input className="mb-4 bg-transparent border-gray-700 text-white placeholder-gray-500" placeholder="Search Users" />
      <div className="flex-grow overflow-auto">
        {friends.map((friend) => (
          <div 
            key={friend.id} 
            className="flex items-center mb-4 border border-gray-700 rounded-lg p-2 hover:bg-gray-900 transition-colors cursor-pointer"
            onClick={() => setSelectedFriend(friend)}
          >
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={`/placeholder-avatar-${friend.id}.jpg`} />
              <AvatarFallback>{friend.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <h3 className="font-semibold">{friend.name}</h3>
              <p className="text-sm text-gray-400">{friend.lastMsg}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">{friend.time}</span>
              {friend.unread > 0 && (
                <span className="bg-white text-black text-xs rounded-full px-2 py-1 mt-1">
                  {friend.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const ChatView = () => (
    <div className="flex-grow flex flex-col h-full">
      <div className="flex items-center mb-4 pb-2 border-b border-gray-700">
        {isMobileView && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => setSelectedFriend(null)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={`/placeholder-avatar-${selectedFriend?.id}.jpg`} />
          <AvatarFallback>{selectedFriend?.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{selectedFriend?.name}</h2>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      <div className="flex-grow overflow-auto mb-4">
        <div className="mb-2">
          <div className="inline-block bg-gray-800 rounded-lg p-2 max-w-xs">
            <p>Hey</p>
            <span className="text-xs text-gray-500">9:22am</span>
          </div>
        </div>
        <div className="mb-2 text-right">
          <div className="inline-block bg-gray-700 rounded-lg p-2 max-w-xs">
            <p>Hello</p>
            <span className="text-xs text-gray-500">9:23am</span>
          </div>
        </div>
      </div>

      <div className="flex">
        <Input 
          className="flex-grow mr-2 bg-transparent border-gray-700 text-white placeholder-gray-500" 
          placeholder="Type Message Here..." 
        />
        <Button size="icon" className="bg-white text-black hover:bg-gray-200">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-black text-white p-4">
      {(!isMobileView || !selectedFriend) && <FriendList />}
      {(!isMobileView || selectedFriend) && (
        <div className={`${isMobileView ? 'w-full' : 'w-2/3'} md:border-l md:border-gray-700 md:pl-4`}>
          {selectedFriend ? <ChatView /> : <div className="hidden md:block">Select a friend to start chatting</div>}
        </div>
      )}
    </div>
  )
}