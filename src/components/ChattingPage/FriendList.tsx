import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useState } from "react";
import { getFriendList } from "../../services/operations/ChatAPI";
import { setActiveUser } from "../../redux/slice/activeUserSlice";
import { Check, CheckCheck } from "lucide-react";

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
                            <div className="flex">
                                <span className="pt-1">
                                    {friend.statusForUI === "sent" && (friend.status === "sent" ? (
                                        <Check size={16} color='grey' />
                                    ) : friend.status === "received" ? (
                                        <CheckCheck size={16} color='grey' />
                                    ) : (
                                        <CheckCheck size={16} color='white' />
                                    ))}
                                </span>
                                {friend.content === "" ? <p className="text-sm font-bold text-green-400">&#x2022; New Connection</p> : <p className={`text-sm text-gray-400 ${friend.statusForUI==="sent" && "ml-1"}`}>{friend.content.length > 20 ? `${friend.content.slice(0, 20)}...` : friend.content}</p>}
                            </div>
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
