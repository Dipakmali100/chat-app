import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { connectUser, searchUser } from '../../services/operations/ConnectionAPI';
import { Button } from '../ui/button';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { Skeleton } from '../ui/skeleton';
import { Check, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setRefreshFriendList } from '../../redux/slice/eventSlice';
import { toast } from '../../hooks/use-toast';
import VerifiedTick from '../../assets/VerifiedTick.png';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface User {
    id: number;
    username: string;
    imgUrl: string;
    verified: boolean;
    isConnected: boolean;
}

function SearchView() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [onceSearch, setOnceSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const debouncingSearchValue = useDebouncedValue(searchTerm, 500);
    const dispatch = useDispatch();
    const { user }: any = useAuth();
    const userId = user?.userId;
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setSearchTerm(""); // Reset search term when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!debouncingSearchValue) {
            setSearchResults([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            const response = await searchUser(debouncingSearchValue);
            setSearchResults(response.data);
            setOnceSearch(true);
            setLoading(false);
        };

        fetchData();
    }, [debouncingSearchValue]);

    useEffect(() => {
        if (searchTerm === "") {
            setOnceSearch(false);
        } else {
            setLoading(true);
        }
    }, [searchTerm]);

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleConnectUser = async (searchUserId: number, username: string) => {
        await connectUser(searchUserId);
        toast({
            title: "Successfully Connected to " + username,
            duration: 2000,
        })
        if (socket && userId) {
            socket.emit("sendMessage", { senderId: userId, receiverId: searchUserId, isNewMessage: false });
        }
        const response = await searchUser(debouncingSearchValue);
        setSearchResults(response.data);
        dispatch(setRefreshFriendList(Math.random()));
    };

    return (
        <div className="relative w-full" ref={ref}>
            <Input
                className="mb-2 bg-transparent border-gray-700 text-white placeholder-gray-500"
                placeholder="Search Usernames Here..."
                value={searchTerm.toLowerCase()}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                }}
            />
            {searchTerm && (
                <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={handleClearSearch}
                >
                    <X className="h-4 w-4 hover:text-white" />
                </div>
            )}

            {/* Search results */}
            {searchTerm && (
                <div className="absolute z-50 w-full border-2 border-slate-700 rounded-lg gap-2 px-2 bg-[#030303]">
                    {loading ? (
                        <div className="flex items-center space-x-4 py-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[100px] md:w-[200px]" />
                                <Skeleton className="h-3 w-[150px] md:w-[250px]" />
                            </div>
                        </div>
                    ) : onceSearch && searchResults.length === 0 ? (
                        <div className='text-white text-center font-bold py-2'>No results found</div>
                    ) : (
                        searchResults.map((user, index) => (
                            <div key={user.id}>
                                <div className={`flex items-center justify-between py-2 ${index === 0 ? "" : "border-t-2 border-slate-700"}`}>
                                    <div className="flex items-center">
                                        <Avatar className="h-10 w-10 mr-3 bg-gray-200">
                                            <AvatarImage src={user.imgUrl} />
                                            <AvatarFallback className="text-black font-bold">{user.username[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className='flex gap-1'>
                                            <p className="font-bold">{user.username}</p>
                                            {user.verified && (
                                                <img src={VerifiedTick} alt="Verified" className='w-4 h-4 mt-1' />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {user.isConnected ? <Check className="text-green-500 mr-2" /> : <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-black"
                                            onClick={() => handleConnectUser(user.id, user.username)}>
                                            Connect
                                        </Button>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchView;
