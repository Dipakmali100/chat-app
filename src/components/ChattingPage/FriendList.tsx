import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type Friend = {
    id: number;
    name: string;
    lastMsg: string;
    time: string;
    unread: number;
}

function FriendList({ setSelectedFriend }: any) {
    const friends: Friend[] = [
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
        { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
        { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
        { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    ]
    return (
        <div className="">
            <div className="flex-grow">
                {friends.map((friend: any) => (
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
}

export default FriendList
