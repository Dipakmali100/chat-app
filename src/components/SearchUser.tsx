import React, { useState } from 'react'
import { connectUser, searchUser } from '../services/operations/ConnectionAPI';

function SearchUser() {
    const [username, setUsername] = useState<string>('');
    const [matchedUsers, setMatchedUsers] = useState([]);

    const handleSearchCall = async () => {
        const response: any = await searchUser(username);
        console.log(response.data);
        setMatchedUsers(response.data);
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSearchCall();
    }
    const handleConnect = async (userId: number) => {
        await connectUser(userId);
        await handleSearchCall();
    }
    return (
        <div className='border-2 border-black'>
            <h1 className='font-bold'>Search Users</h1>
            <form onSubmit={handleSubmit}>
                <input className="border-2 border-black" type="text" placeholder='Search user here' value={username} onChange={(e) => { setUsername(e.target.value.toLowerCase()) }} />
                <button type="submit">Search</button>
            </form>

            {matchedUsers.length === 0 ? <div>No users found</div> : matchedUsers.map((user: any) => {
                return (
                    <div key={user.id}>
                        {user.id + " " + user.username + " " + user.isConnected}
                        {user.isConnected ? <button disabled>Connected</button> : <button onClick={() => handleConnect(user.id)}>Connect</button>}
                    </div>
                )
            })}
        </div>
    )
}

export default SearchUser