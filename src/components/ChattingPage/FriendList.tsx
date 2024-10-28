import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useState } from "react";
import { getFriendList } from "../../services/operations/ChatAPI";
import { setActiveUser } from "../../redux/slice/activeUserSlice";
import { Check, CheckCheck } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import VerifiedTick from "../../assets/VerifiedTick.png";

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

function FriendList({ activeUsers }: any) {
    const { refreshFriendList } = useSelector((state: any) => state.event);
    const [loader, setLoader] = useState(false);
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const dispatch = useDispatch();

    async function fetchData() {
        setLoader(true);
        const response = await getFriendList();
        console.log("Fetching friend list due to refreshFriendList change:", refreshFriendList);
        setFriendList(response.data);
        setLoader(false);
        updatingTitle(response.data);
    }

    async function updatingTitle(friendList: any) {
        let pendingMessagesCount = 0;
        if (friendList) {
            friendList.map((friend: any) => {
                if (friend.pendingMessages > 0) {
                    pendingMessagesCount += 1;
                }
            })
        }
        if (pendingMessagesCount > 0) {
            document.title = `(${pendingMessagesCount}) ChatNow`;
        } else {
            document.title = "ChatNow";
        }
    }

    useEffect(() => {
        fetchData();
    }, [refreshFriendList]);

    return (
        <div className="">
            <div className="flex-grow">
                {!friendList || friendList.length === 0 ? (
                    loader ? (
                        // run the skeleton 10 time
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex items-center mb-4 border border-gray-700 rounded-lg p-2 hover:bg-gray-900 transition-colors cursor-pointer">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 ml-2">
                                    <Skeleton className="h-4 w-[100px] md:w-[200px]" />
                                    <Skeleton className="h-3 w-[150px] md:w-[250px]" />
                                </div>
                            </div>
                        ))
                    ) : <div className="text-center p-10">
                        <Label className="text-xl">No Friends Yet</Label><br />
                        <Label className="text-md text-gray-400">Start searching to connect with others!</Label>
                    </div>
                ) : (friendList.map((friend: any, index: number) => (
                    <div
                        key={index}
                        className="flex items-center mb-4 border border-gray-700 rounded-lg p-2 hover:bg-gray-900 transition-colors cursor-pointer"
                        onClick={() => dispatch(setActiveUser({ friendId: friend.senderId, username: friend.username, imgUrl: friend.imgUrl, verified: friend.verified }))}
                    >
                        <div className="relative">
                            {activeUsers[friend.senderId] && <div className={`absolute left-8 top-7 z-10 w-2 h-2 bg-green-500 rounded-full`}>
                            </div>}
                            <Avatar className="h-10 w-10 mr-3 bg-gray-200">
                                <AvatarImage src={friend.imgUrl} />
                                <AvatarFallback>{friend.username[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-grow">
                            <div className="flex gap-1">
                                <h3 className="font-semibold">{friend.username}</h3>
                                {friend.verified && (
                                    <img src={VerifiedTick} alt="Verified" className='w-4 h-4 mt-1' />
                                )}
                            </div>
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
                                {friend.content === "" ? friend.chatStarted ? <i className="text-sm text-gray-400">&#x2022; Chat has been deleted</i> : <p className="text-sm font-bold text-green-400">&#x2022; New Connection</p> : <p className={`text-sm text-gray-400 ${friend.statusForUI === "sent" && "ml-1"}`}>{friend.content.length > 20 ? `${friend.content.slice(0, 20)}...` : friend.content}</p>}
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
                )))}
            </div>
        </div>
    )
}

export default FriendList
