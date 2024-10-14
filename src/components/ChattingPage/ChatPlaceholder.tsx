import { MessageCircle } from 'lucide-react';

function ChatPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative">
        <div className="absolute inset-0 bg-white rounded-full opacity-25 animate-ping"></div>
        <div className="relative bg-white text-black p-6 rounded-full">
          <MessageCircle size={48} />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-semibold text-white">Start a Conversation</h2>
      <p className="mt-2 text-gray-400 text-center max-w-md">
        Select a friend from the list to begin chatting. Your messages will appear here.
      </p>
      <div className="mt-8 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default ChatPlaceholder;
