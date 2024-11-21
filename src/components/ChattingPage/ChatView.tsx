import { Button } from '../ui/button';
import { ArrowLeft, Check, CheckCheck, Clock3, EllipsisVertical, Files, ReplyAll, Send, Trash2, Trash2Icon, UserRoundX, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../../redux/slice/activeUserSlice';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { deleteChat, deleteMessage, getChat, sendMessage } from '../../services/operations/ChatAPI';
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
import formatMessages from '../../utils/formatMessages';
import VerifiedTick from '../../assets/VerifiedTick.png';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import CopyToClipboard from 'react-copy-to-clipboard';
import { deleteMessageFromChat } from '../../utils/deleteMessageFromChat';
import MessageDeleteTone from '../../assets/sound-effects/MessageDeleteTone.mp3';
import MessageSentTone from '../../assets/sound-effects/MessageSentTone.mp3';
import MessageReceivedTone from '../../assets/sound-effects/MessageReceivedTone.mp3';
import { Label } from '../ui/label';

function ChatView({ activeUsers }: any) {
    const { friendId, username, imgUrl, verified } = useSelector((state: any) => state.activeUser);
    const { refreshChat } = useSelector((state: any) => state.event);
    const [chat, setChat] = useState<any>([]);
    const [alertType, setAlertType] = useState("");
    const [deleteForBoth, setDeleteForBoth] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState<any>({});
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [shouldTextAreaFocus, setShouldTextAreaFocus] = useState(false);
    const [replyMsgId, setReplyMsgId] = useState(1);
    const [replyMsgContent, setReplyMsgContent] = useState<any>({});
    const { user }: any = useAuth();
    const socket = useSocket();
    const dispatch = useDispatch();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messageRefs = useRef(new Map());
    const deleteAudioRef = useRef<HTMLAudioElement>(null);
    const sentAudioRef = useRef<HTMLAudioElement>(null);
    const receivedAudioRef = useRef<HTMLAudioElement>(null);

    async function fetchData() {
        setLoading(true);
        const response = await getChat(friendId);
        const formattedChat = await formatMessages(response.data);
        setChat(formattedChat);
        setLoading(false);
        console.log("Chat got refreshed");
    }

    async function handleMessageSubmit(e: any) {
        e.preventDefault();
        if (!message) {
            return;
        }
        setShouldTextAreaFocus(true);
        const date = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const amOrPm = hours >= 12 ? "PM" : "AM";
        const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${amOrPm}`;
        let onGoingMessageObject = {
            id: Date.now(),
            isReply: replyMsgId !== 1,//
            senderId: user?.userId,
            receiverId: friendId,
            msgType: "text",//
            content: message.trim(),
            status: "going",
            createdAt: Date.now(),
            statusForUI: "sent",
            time: formattedTime,
            date: "Today",
            replyMsgType: "text",//
            replyMsgContent: replyMsgContent.content,//
            replyMsgSenderId: replyMsgContent.senderId,//
        };

        // Update chat state correctly by pushing the new message to the array
        setChat((prevChat: any) => ({
            ...prevChat,
            Today: [...(prevChat.Today || []), onGoingMessageObject] // Ensure 'Today' is initialized as an array
        }));
        setIsNewMessage(true);

        // Temporariry storing message details before setting to default state
        const currentReplyMsgId = replyMsgId;
        const currentMessage = message;

        // Setting state to default, So it will not show in UI
        setReplyMsgId(1);
        setReplyMsgContent({});
        setMessage("");

        const response = await sendMessage(currentReplyMsgId !== 1, currentReplyMsgId, friendId, currentMessage);
        if (response.success) {
            await fetchData();
            dispatch(setRefreshFriendList(Math.random()));
            if (sentAudioRef.current) {
                sentAudioRef.current.play();
            }
            socket?.emit("sendMessage", { senderId: user?.userId, receiverId: friendId, isNewMessage: true });
        } else {
            alert(response.message);
        }
    }

    // Function to focus on a specific message
    const focusMessage = (messageId: number) => {
        console.log("messageId: ", messageId);
        const messageRef = messageRefs.current.get(messageId);
        if (messageRef) {
            messageRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            messageRef.classList.add('bg-gray-600');
            setTimeout(() => {
                messageRef.classList.remove('bg-gray-600');
            }, 1500); 
        }
    };

    async function handleDeleteChat() {
        const response = await deleteChat(friendId);
        if (response.success) {
            await fetchData();
            dispatch(setRefreshFriendList(Math.random()));
            socket?.emit("sendMessage", { senderId: user?.userId, receiverId: friendId, isNewMessage: false });
            toast({
                title: "Chat Deleted Successfully",
                duration: 1000,
            })
        } else {
            toast({
                title: response.message,
                variant: "destructive",
                duration: 2000,
            })
        }
    }

    async function handleDisconnect() {
        const response = await disconnectUser(friendId, deleteForBoth);
        setDeleteForBoth(false);
        if (response.success) {
            dispatch(setRefreshFriendList(Math.random()));
            dispatch(setActiveUser({ friendId: 0, username: "", imgUrl: "" }));
            socket?.emit("sendMessage", { senderId: user?.userId, receiverId: friendId, isDisconnect: true });
            toast({
                title: "Disconnected Successfully",
                duration: 1000,
            })
        } else {
            toast({
                title: response.message,
                variant: "destructive",
                duration: 2000,
            })
        }
    }

    const handleDeleteMessage = async (messageId: number) => {
        const optimisticChat = await deleteMessageFromChat(chat, messageId);
        setChat(optimisticChat);
        if (deleteAudioRef.current) {
            deleteAudioRef.current.play();
        }
        const response = await deleteMessage(messageId);
        if (response.success) {
            dispatch(setRefreshFriendList(Math.random()));
            socket?.emit("deleteMessage", { senderId: user?.userId, receiverId: friendId, messageId });
            toast({
                title: "Message Deleted Successfully",
                duration: 1000,
            });
        } else {
            toast({
                title: response.message,
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    useEffect(() => {
        if (shouldTextAreaFocus) {
            inputRef.current?.focus();
            setShouldTextAreaFocus(false); // Reset to avoid redundant focusing
        }
    }, [shouldTextAreaFocus]);

    useEffect(() => {
        // Scroll to bottom when only new message arrives and friend chat get changed
        if (isNewMessage) {
            if (chatEndRef.current) {
                chatEndRef.current.scrollIntoView({ behavior: 'instant' });
                if (Object.keys(chat).length > 0) {
                    setIsNewMessage(false);
                }
            }
        }
    }, [chat]);

    useEffect(() => {
        if (!socket) {
            console.log("Socket not found");
            return;
        }

        const handleTyping = (data: any) => {
            if (data.isTyping) {
                setTypingUsers((prev: any) => {
                    return {
                        ...prev,
                        [data.senderId]: true
                    }
                })
            } else {
                setTypingUsers((prev: any) => {
                    return {
                        ...prev,
                        [data.senderId]: false
                    }
                })
            }
        }

        const handleNewMessage = async (data: any) => {
            console.log("New Message From FriendId: ", data.senderId);
            if (Number(data.senderId) === Number(friendId)) {
                if (data.isDisconnect) {
                    dispatch(setActiveUser({ friendId: 0, username: "", imgUrl: "" }));
                    return;
                }
                if (data.isNewMessage) {
                    if (receivedAudioRef.current) {
                        receivedAudioRef.current.play();
                    }
                    setIsNewMessage(true);
                }
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

        // Handle delete message event
        socket.on("deleteMessage", handleNewMessage);

        // Handle typing event
        socket.on("typing", handleTyping);

        // Cleanup function
        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("deleteMessage", handleNewMessage);
        };
    }, [friendId, username, socket]);

    useEffect(() => {
        // when this chat component is opened, then it will notify the server
        if (friendId) {
            socket?.emit("chatOpened", { senderId: user?.userId, receiverId: friendId });
        }
    }, [friendId]);

    // Emit typing event
    useEffect(() => {
        if (!message || message === "") {
            socket?.emit('typing', { senderId: user?.userId, receiverId: friendId, isTyping: false });
            return;
        }

        socket?.emit('typing', { senderId: user?.userId, receiverId: friendId, isTyping: true });
    }, [message]);

    // When user suddenly gets disconnected, then set typing to false
    useEffect(() => {
        Object.keys(typingUsers).forEach((key: any) => {
            if (!activeUsers[key]) {
                typingUsers[key] = false;
            }
        })
    }, [activeUsers]);

    // Reset chat and turning isNewMessage to true when friendId changes, So as the friend chat gets changed then chat should scroll to bottom
    useEffect(() => {
        setChat([]);
        setIsNewMessage(true);
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
            socket?.emit('typing', { senderId: user?.userId, receiverId: friendId, isTyping: false });
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
                        <div className="p-2 mx-2 md:hidden cursor-pointer hover:rounded-full hover:bg-gray-800"
                            onClick={() => {
                                dispatch(setActiveUser({ friendId: 0, username: "", imgUrl: "", verified: false }));
                                socket?.emit('typing', { senderId: user?.userId, receiverId: friendId, isTyping: false });
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <Avatar className="h-10 w-10 mr-3 bg-gray-200">
                            <AvatarImage src={imgUrl} />
                            <AvatarFallback>{username[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className='flex gap-1'>
                            <h2 className="font-semibold">{username}</h2>
                            {verified && (
                                <img src={VerifiedTick} alt="Verified" className='w-4 h-4 mt-1' />
                            )}
                        </div>
                        <p className={`text-sm ${typingUsers[friendId] && activeUsers[friendId] ? "text-green-500 font-bold" : activeUsers[friendId] ? "text-green-500 font-bold" : "text-gray-400"}`}>{typingUsers[friendId] && activeUsers[friendId] ? "Typing..." : activeUsers[friendId] ? "Online" : "Offline"}</p>
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
                    Object.keys(chat).map((date, index) => (
                        <div key={index}>
                            <div className='sticky top-0 text-xs text-gray-400 flex justify-center mb-3 '>
                                <p className='bg-gray-900 py-1 px-2 rounded-sm'>{date}</p>
                            </div>
                            {
                                chat[date].map((message: any) => (
                                    (message.statusForUI === "received" ? (
                                        <ContextMenu key={message.id}>
                                            <ContextMenuTrigger>
                                                <div className="mb-1 select-none" key={message.id} >
                                                    <div className="inline-block bg-gray-800 rounded-lg px-1 pt-1 max-w-xs overflow-hidden break-words cursor-default" ref={(el) => messageRefs.current.set(message.id, el)}>
                                                        {message.isReply && (
                                                            <div className='bg-black text-left max-w-xs rounded-md px-2 py-[6px] mb-1 border-l-4 border-[#11FFFB] cursor-pointer' onClick={() => focusMessage(message.replyMsgId)} >
                                                                <Label className='text-[#11FFFB] cursor-pointer'>{message.replyMsgSenderId === user?.userId ? "You" : username}</Label>
                                                                <div>{message.replyMsgContent.length > 30 ? message.replyMsgContent.substring(0, 30) + "..." : message.replyMsgContent}</div>
                                                            </div>
                                                        )}
                                                        <p className='text-white break-words px-1'>
                                                            {message.content.split('\n').map((item: string, index: number) => (
                                                                <span key={index}>
                                                                    {item}
                                                                    <br />
                                                                </span>
                                                            ))}
                                                        </p>
                                                        <div className="text-xs text-gray-500 pb-1 px-1">{message.time}</div>
                                                    </div>
                                                </div>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent className="w-28 bg-black border-2 border-gray-700">
                                                <ContextMenuItem className='text-white text-sm cursor-pointer flex justify-left gap-1 p-1 hover:bg-white hover:text-black rounded-sm' onClick={() => {
                                                    setReplyMsgId(message.id); setReplyMsgContent(message); setTimeout(() => {
                                                        setShouldTextAreaFocus(true);
                                                    }, 0);
                                                }}>
                                                    <ReplyAll size={16} className='mx-1' />
                                                    Reply
                                                </ContextMenuItem>
                                                <CopyToClipboard text={message.content} onCopy={() => toast({ title: 'Copied to clipboard!', duration: 1000 })}>
                                                    <ContextMenuItem className='text-white text-sm cursor-pointer flex justify-left gap-1 p-1 hover:bg-white hover:text-black rounded-sm'>
                                                        <Files size={16} className='mx-1' />
                                                        Copy
                                                    </ContextMenuItem>
                                                </CopyToClipboard>
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    ) : (
                                        <ContextMenu key={message.id}>
                                            <ContextMenuTrigger>
                                                <div className="mb-1 text-right select-none" key={message.id}>
                                                    <div className="inline-block bg-gray-800 rounded-lg px-1 pt-1 max-w-xs overflow-hidden break-words" ref={(el) => messageRefs.current.set(message.id, el)}>
                                                        {message.isReply && (
                                                            <div className='bg-black text-left max-w-xs rounded-md px-2 py-[6px] mb-1 border-l-4 border-[#0195F7] cursor-pointer' onClick={() => focusMessage(message.replyMsgId)} >
                                                                <Label className='text-[#0195F7] cursor-pointer'>{message.replyMsgSenderId === user?.userId ? "You" : username}</Label>
                                                                <div>{message.replyMsgContent.length > 30 ? message.replyMsgContent.substring(0, 30) + "..." : message.replyMsgContent}</div>
                                                            </div>
                                                        )}
                                                        <p className='text-left break-words px-1'>
                                                            {message.content.split('\n').map((item: string, index: number) => (
                                                                <span key={index}>
                                                                    {item}
                                                                    <br />
                                                                </span>
                                                            ))}
                                                        </p>
                                                        <div className='flex justify-between gap-2 pb-1 px-1'>
                                                            <p className="text-xs text-gray-500">{message.time}</p>
                                                            {message.status === "sent" ? (
                                                                <Check size={16} color='grey' />
                                                            ) : message.status === "received" ? (
                                                                <CheckCheck size={16} color='grey' />
                                                            ) : message.status === "seen" ? (
                                                                <CheckCheck size={16} strokeWidth={2.5} color="#0195F7" />
                                                            ) : (
                                                                <Clock3 size={16} color='grey' />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent className="w-28 bg-black border-2 border-gray-700">
                                                <ContextMenuItem key={message.id} className='text-white text-sm cursor-pointer flex justify-left gap-1 p-1 hover:bg-white hover:text-black rounded-sm' onClick={() => {
                                                    setReplyMsgId(message.id); setReplyMsgContent(message); setTimeout(() => {
                                                        setShouldTextAreaFocus(true);
                                                    }, 0);
                                                }}>
                                                    <ReplyAll size={16} className='mx-1' />
                                                    Reply
                                                </ContextMenuItem>
                                                <CopyToClipboard text={message.content} onCopy={() => toast({ title: 'Copied to clipboard!', duration: 1000 })}>
                                                    <ContextMenuItem key={message.id} className='text-white text-sm cursor-pointer flex justify-left gap-1 p-1 hover:bg-white hover:text-black rounded-sm'>
                                                        <Files size={16} className='mx-1' />
                                                        Copy
                                                    </ContextMenuItem>
                                                </CopyToClipboard>
                                                <ContextMenuItem className='text-red-600 text-sm cursor-pointer flex justify-left gap-1 p-1 hover:bg-white hover:text-red-600 rounded-sm' onClick={() => handleDeleteMessage(message.id)}>
                                                    <Trash2Icon size={16} className='mx-1' />
                                                    Delete
                                                </ContextMenuItem>
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    ))
                                ))
                            }
                        </div>
                    ))
                )}

                {/* This div will help scroll to the bottom */}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleMessageSubmit}>
                {replyMsgId !== 1 && (
                    <div className='flex flex-col border-t-2 border-gray-700 px-5 py-2'>
                        <div className='flex justify-between'>
                            <Label>Replying to {replyMsgContent.senderId === user?.userId ? "You" : username}</Label>
                            <X className='cursor-pointer' size={18} onClick={() => {
                                setReplyMsgId(1); setReplyMsgContent({}); setShouldTextAreaFocus(true);
                            }} />
                        </div>
                        <div className='text-[#B1B2B8] font-medium'>
                            <Label>{replyMsgContent.content.length > 90 ? replyMsgContent.content.slice(0, 90) + "..." : replyMsgContent.content}</Label>
                        </div>
                    </div>
                )}
                <div className="relative flex px-2 md:px-4">

                    <Textarea
                        ref={inputRef}
                        className="flex-grow mr-2 bg-transparent border-gray-700 text-white placeholder-gray-500 h-8 max-h-20"
                        placeholder="Type Message Here..."
                        value={message}
                        onChange={(e) => { setMessage(e.target.value); }}
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

            {/* Sound effects */}
            <audio ref={deleteAudioRef} src={MessageDeleteTone} />
            <audio ref={sentAudioRef} src={MessageSentTone} />
            <audio ref={receivedAudioRef} src={MessageReceivedTone} />
        </div>
    )
}

export default ChatView
