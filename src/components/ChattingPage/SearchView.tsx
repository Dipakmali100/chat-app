import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { connectUser, searchUser } from '../../services/operations/ConnectionAPI';
import { Button } from '../ui/button';
import useDebouncedValue from '../../hooks/useDebouncedValue';

interface User {
    id: number;
    username: string;
    imgUrl: string;
    isConnected: boolean;
}

function SearchView() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const debouncingSearchValue = useDebouncedValue(searchTerm, 500);

    useEffect(() => {
        // API call or other actions to be performed with debounced value
        if (!debouncingSearchValue) {
            setSearchResults([]);
            return;
        }

        const fetchData = async () => {
            const response = await searchUser(debouncingSearchValue);
            setSearchResults(response.data);
        }

        fetchData();
    }, [debouncingSearchValue]);

    return (
        <div className="w-full">
            <Input
                className="mb-2 bg-transparent border-gray-700 text-white placeholder-gray-500"
                placeholder="Search Usernames Here..."
                value={searchTerm.toLowerCase()}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                }}
            />

            {searchResults.length === 0 ? (
                <div>No users found</div>
            ) : (
                searchResults.map((user) => (
                    <div key={user.id}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={user.imgUrl}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <div>
                                    <p className="font-bold">{user.username}</p>
                                </div>
                            </div>
                            <div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => connectUser(user.id)}>
                                    Connect
                                </Button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default SearchView;
