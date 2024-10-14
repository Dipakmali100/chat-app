import { Input } from '../ui/input'

function SearchView() {
    return (
        <div className="w-full">
            <Input className="mb-2 bg-transparent border-gray-700 text-white placeholder-gray-500" placeholder="Search Usernames Here..." />
        </div>
    )
}

export default SearchView
