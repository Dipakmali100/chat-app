import { Button } from '../ui/button';
import { ArrowLeft, Check, CheckCheck, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../../redux/slice/activeUserSlice';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getChat, sendMessage } from '../../services/operations/ChatAPI';
import { setRefreshFriendList } from '../../redux/slice/eventSlice';
import { Textarea } from '../ui/textarea';

function ChatView({ activeUsers }: any) {
    const { friendId, username, imgUrl } = useSelector((state: any) => state.activeUser);
    const { refreshChat } = useSelector((state: any) => state.event);
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");
    const { user }: any = useAuth();
    const socket = useSocket();
    const dispatch = useDispatch();
    const chatEndRef = useRef<HTMLDivElement>(null);
    async function fetchData() {
        const response = await getChat(friendId);
        setChat(response.data);
        console.log("Chat got refreshed");
    }
    async function handleMessageSubmit(e: any) {
        e.preventDefault();
        if (!message) {
            return;
        }
        const response = await sendMessage(friendId, message);
        if (response.success) {
            await fetchData();
            setMessage("");
            dispatch(setRefreshFriendList(Math.random()));
            socket?.emit("sendMessage", { senderId: user?.userId, receiverId: friendId, content: message });
        } else {
            alert(response.message);
        }
    }

    useEffect(() => {
        // Scroll to the bottom of the chat
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'instant' });
        }
    }, [chat]); // Dependency on chat to scroll when messages change

    useEffect(() => {
        if (!socket) {
            console.log("Socket not found");
            return;
        }

        const handleNewMessage = async (data: any) => {
            console.log("New Message From FriendId: ", data.senderId);
            if (Number(data.senderId) === Number(friendId)) {
                handler(); // Fetch new chat data on receiving a new message
            }
        };

        // Define the handler function here
        const handler = async () => {
            if (friendId) { // Ensure friendId is defined before fetching
                await fetchData();
                dispatch(setRefreshFriendList(Math.random()));
            }
        };

        // Call handler initially
        handler();

        // Set up the socket listener
        socket.on("newMessage", handleNewMessage);

        // Cleanup function
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [friendId, username, socket]);

    useEffect(() => {
        // when this chat component is opened, then it will notify the server
        if (friendId) {
            socket?.emit("chatOpened", { senderId: user?.userId, receiverId: friendId });
        }
    }, [friendId]);

    useEffect(() => {
        const refreshChatHandler = async () => {
            if (parseInt(refreshChat) === friendId) {
                await fetchData();
            }
        }
        refreshChatHandler();
        console.log("Refresh Chat: ", refreshChat);
    }, [refreshChat]);

    return (
        <div className="flex-grow flex flex-col h-full">
            <div className="flex items-center mb-4 pb-2 border-b border-gray-700 md:px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 md:hidden"
                    onClick={() => dispatch(setActiveUser({ friendId: 0, username: "", imgUrl: "" }))}
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={imgUrl} />
                    <AvatarFallback>{username[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold">{username}</h2>
                    <p className={`text-sm ${activeUsers[friendId] ? "text-green-500 font-bold" : "text-gray-400"}`}>{activeUsers[friendId] ? "Online" : "Offline"}</p>
                </div>
            </div>

            <div className="flex-grow overflow-auto mb-4 px-2 md:px-4">
                {chat.map((message: any) => (
                    (message.statusForUI === "received" ? (
                        <div className="mb-2" key={message.id}>
                            <div className="inline-block bg-white rounded-lg p-2 max-w-xs overflow-hidden break-words">
                                <p className='text-black break-words'>
                                    {message.content.split('\n').map((item: string, index: number) => (
                                        <span key={index}>
                                            {item}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                                <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-2 text-right" key={message.id}>
                            <div className="inline-block bg-gray-800 rounded-lg px-2 pt-2 max-w-xs overflow-hidden break-words">
                                <p className='text-left break-words'>
                                    {message.content.split('\n').map((item: string, index: number) => (
                                        <span key={index}>
                                            {item}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                                <div className='flex justify-between py-2 gap-2'>
                                    <p className="text-xs text-gray-500">{message.time}</p>
                                    {message.status === "sent" ? (
                                        <Check size={16} color='grey' />
                                    ) : message.status === "received" ? (
                                        <CheckCheck size={16} color='grey' />
                                    ) : (
                                        <CheckCheck size={16} color='white' />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ))}

                {/* This div will help scroll to the bottom */}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleMessageSubmit}>
                <div className="flex px-2 md:px-4">
                    <Textarea
                        className="flex-grow mr-2 bg-transparent border-gray-700 text-white placeholder-gray-500 h-8 max-h-20"
                        placeholder="Type Message Here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            const isTabletOrLarger = window.innerWidth > 768;
                            if (isTabletOrLarger && e.key === 'Enter') {
                                if (e.shiftKey) {
                                    // Allow new line
                                    return;
                                } else {
                                    handleMessageSubmit(e); // Call your submit function
                                }
                            }
                        }}
                    />
                    <div className='flex flex-col justify-end'>
                        <Button size="icon" type='submit' className="bg-white text-black hover:bg-gray-200">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ChatView
