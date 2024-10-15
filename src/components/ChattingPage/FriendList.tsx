import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useState } from "react";
import { getFriendList } from "../../services/operations/ChatAPI";
import { setActiveUser } from "../../redux/slice/activeUserSlice";

type Friend = {
    senderId: number;
    username: string;
    pendingMessages: number;
    content: string;
    imgUrl: string;
    time: string;
    date: string;
    createdAt: string;
}

function FriendList() {
    // const friends: Friend[] = [
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    //     { id: 1, name: "Alice", lastMsg: "Hey there!", time: "10:30", unread: 2 },
    //     { id: 2, name: "Bob", lastMsg: "How are you?", time: "09:45", unread: 0 },
    //     { id: 3, name: "Charlie", lastMsg: "Meeting at 2?", time: "Yesterday", unread: 5 },
    // ]

    const { refreshFriendList } = useSelector((state: any) => state.event);
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const dispatch = useDispatch();

    async function fetchData() {
        const response = await getFriendList();
        console.log("Fetching friend list due to refreshFriendList change:", refreshFriendList);
        setFriendList(response.data);
    }
    useEffect(() => {
        fetchData();
    }, [refreshFriendList]);

    return (
        <div className="">
            <div className="flex-grow">
                {friendList.map((friend: any) => (
                    <div
                        key={friend.senderId}
                        className="flex items-center mb-4 border border-gray-700 rounded-lg p-2 hover:bg-gray-900 transition-colors cursor-pointer"
                        onClick={() => dispatch(setActiveUser({ friendId: friend.senderId, username: friend.username, imgUrl: friend.imgUrl }))}
                    >
                        <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={friend.imgUrl} />
                            <AvatarFallback>{friend.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <h3 className="font-semibold">{friend.username}</h3>
                            <p className="text-sm text-gray-400">{friend.content}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500">{friend.date === "Today" ? friend.time : friend.date}</span>
                            {friend.pendingMessages > 0 && (
                                <span className="bg-white text-black text-xs rounded-full px-2 py-1 mt-1">
                                    {friend.pendingMessages}
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
