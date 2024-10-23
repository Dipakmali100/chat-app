import { Button } from '../ui/button';
import { ArrowLeft, Check, CheckCheck, Clock3, EllipsisVertical, Send, Trash2, UserRoundX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../../redux/slice/activeUserSlice';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { deleteChat, getChat, sendMessage } from '../../services/operations/ChatAPI';
import { setRefreshFriendList } from '../../redux/slice/eventSlice';
import { Textarea } from '../ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Checkbox } from '../ui/checkbox';
import { toast } from '../../hooks/use-toast';
import { disconnectUser } from '../../services/operations/ConnectionAPI';
import ChatLoader from "../../assets/ChatLoader.svg";

function ChatView({ activeUsers }: any) {
    const { friendId, username, imgUrl } = useSelector((state: any) => state.activeUser);
    const { refreshChat } = useSelector((state: any) => state.event);
    const [chat, setChat] = useState<any>([]);
    const [alertType, setAlertType] = useState("");
    const [deleteForBoth, setDeleteForBoth] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { user }: any = useAuth();
    const socket = useSocket();
    const dispatch = useDispatch();
    const chatEndRef = useRef<HTMLDivElement>(null);
    async function fetchData() {
        setLoading(true);
        const response = await getChat(friendId);
        setChat(response.data);
        setLoading(false);
        console.log("Chat got refreshed");
    }
    async function handleMessageSubmit(e: any) {
        e.preventDefault();
        if (!message) {
            return;
        }
        const date = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const amOrPm = hours >= 12 ? "PM" : "AM";
        const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${amOrPm}`;
        setChat([...chat, { id: Date.now(), senderId: user?.userId, receiverId: friendId, content: message, status: "going", createdAt: Date.now(), statusForUI: "sent", time: formattedTime, date: date.toDateString() }]);

        const currentMessage = message;
        setMessage("");
        const response = await sendMessage(friendId, currentMessage);
        if (response.success) {
            await fetchData();
            dispatch(setRefreshFriendList(Math.random()));
            socket?.emit("sendMessage", { senderId: user?.userId, receiverId: friendId, content: currentMessage });
        } else {
            alert(response.message);
        }
    }

    async function handleDeleteChat() {
        const response = await deleteChat(friendId);
        if (response.success) {
            await fetchData();
            dispatch(setRefreshFriendList(Math.random()));
            socket?.emit("sendMessage", { senderId: user?.userId, receiverId: friendId });
            toast({
                title: "Chat Deleted Successfully",
                duration: 3000,
            })
        } else {
            toast({
                title: response.message,
                variant: "destructive",
                duration: 3000,
            })
        }
    }

    async function handleDisconnect() {
        const response = await disconnectUser(friendId, deleteForBoth);
        setDeleteForBoth(false);
        if (response.success) {
            dispatch(setRefreshFriendList(Math.random()));
            dispatch(setActiveUser({ friendId: 0, username: "", imgUrl: "" }));
            socket?.emit("sendMessage", { senderId: user?.userId, receiverId: friendId });
            toast({
                title: "Disconnected Successfully",
                duration: 3000,
            })
        } else {
            toast({
                title: response.message,
                variant: "destructive",
                duration: 3000,
            })
        }
    }

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'instant' });
        }
    }, [chat]);

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

    // Prevent the back navigation
    useEffect(() => {
        // Push a state to the history stack
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            // Prevent the back navigation
            window.history.pushState(null, '', window.location.href);

            // Dispatch the setActiveUser action
            dispatch(setActiveUser({ friendId: 0, username: "", imgUrl: "" }));
        };

        // Add an event listener for the popstate event
        window.addEventListener('popstate', handlePopState);

        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div className="flex-grow flex flex-col h-full">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700 md:px-4">
                <div className='flex'>
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-2 md:hidden"
                            onClick={() => dispatch(setActiveUser({ friendId: 0, username: "", imgUrl: "" }))}
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <Avatar className="h-10 w-10 mr-3 bg-gray-200">
                            <AvatarImage src={imgUrl} />
                            <AvatarFallback>{username[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h2 className="font-semibold">{username}</h2>
                        <p className={`text-sm ${activeUsers[friendId] ? "text-green-500 font-bold" : "text-gray-400"}`}>{activeUsers[friendId] ? "Online" : "Offline"}</p>
                    </div>
                </div>

                <div className='mr-2 cursor-pointer hover:rounded-full hover:bg-gray-800'>
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <EllipsisVertical className='m-2' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto bg-black border-gray-700">
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="cursor-pointer text-white mt-1" onClick={() => setAlertType("deleteChat")}>
                                        <Trash2 />
                                        <span>Delete Chat</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => setAlertType("disconnect")}>
                                        <UserRoundX />
                                        <span>Disconnect</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {
                            alertType === "deleteChat" ? (
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Chat with {username}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this chat? This action will permanently remove the chat for both parties.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteChat}>Delete Chat</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            ) : (
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Disconnect from {username}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to disconnect? You can always reconnect later.
                                        </AlertDialogDescription>
                                        <div className="flex justify-center sm:justify-start items-center space-x-2">
                                            <Checkbox id="terms" checked={deleteForBoth} onClick={() => setDeleteForBoth(!deleteForBoth)} />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Also delete this chat for both parties
                                            </label>
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteForBoth(false)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDisconnect}>Disconnect</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            )
                        }
                    </AlertDialog>
                </div>
            </div>

            <div className="flex-grow overflow-auto mb-2 px-2 md:px-4">
                {chat.length === 0 && loading ? (
                    <img src={ChatLoader} alt="Loader" className='item-center mx-auto w-6' />
                ) : (
                    chat.map((message: any) => (
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
                                        ) : message.status === "seen" ? (
                                            <CheckCheck size={16} color='white' />
                                        ) : (
                                            <Clock3 size={16} color='grey' />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ))
                )}

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
