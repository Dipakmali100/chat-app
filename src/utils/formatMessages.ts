const formatMessages = async (messages: any) => {
  // Format the messages according to date
  let formattedMessages: any = {};
  messages.forEach((message: any) => {
    if (!formattedMessages[message.date]) {
      formattedMessages[message.date] = [];
    }
    formattedMessages[message.date].push(message);
  });

  return formattedMessages;
};

export default formatMessages;
