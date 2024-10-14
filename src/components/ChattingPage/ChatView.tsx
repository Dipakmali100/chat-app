import { Button } from '../ui/button'
import { ArrowLeft, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'

function ChatView({ selectedFriend, setSelectedFriend }: any) {
    return (
        <div className="flex-grow flex flex-col h-full">
            <div className="flex items-center mb-4 pb-2 border-b border-gray-700">
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 md:hidden"
                    onClick={() => setSelectedFriend(null)}
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`/placeholder-avatar-${selectedFriend?.id}.jpg`} />
                    <AvatarFallback>{selectedFriend?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold">{selectedFriend?.name}</h2>
                    <p className="text-sm text-gray-400">Online</p>
                </div>
            </div>

            <div className="flex-grow overflow-auto mb-4">
                <div className="mb-2">
                    <div className="inline-block bg-gray-800 rounded-lg p-2 max-w-xs">
                        <p>Hey Hello sdjfhsjdfhsjdhfjsdfhd</p>
                        <span className="text-xs text-gray-500">9:22am</span>
                    </div>
                </div>
                <div className="mb-2 text-right">
                    <div className="inline-block bg-gray-700 rounded-lg p-2 max-w-xs">
                        <p>Hello</p>
                        <span className="text-xs text-gray-500">9:23am</span>
                    </div>
                </div>
            </div>

            <div className="flex">
                <Input
                    className="flex-grow mr-2 bg-transparent border-gray-700 text-white placeholder-gray-500"
                    placeholder="Type Message Here..."
                />
                <Button size="icon" className="bg-white text-black hover:bg-gray-200">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default ChatView
