export const deleteMessageFromChat = async (chat: any, messageId: number) => {
    // console.log("Chat Before: ", chat, " MessageId: ", messageId);
    Object.keys(chat).forEach((key) => {
        chat[key] = chat[key].filter((message: any) => {
            return message.id !== messageId;
        });
        if (chat[key].length === 0) {
            delete chat[key];
        }
    });

    // console.log("Updated chat: ", chat);
    return chat;
};
