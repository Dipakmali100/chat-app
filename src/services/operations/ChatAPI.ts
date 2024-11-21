import axios from "axios";
import { ChatApi } from "../apis"

const{GET_FRIEND_LIST, GET_CHAT, SEND_MESSAGE, DELETE_CHAT, DELETE_MESSAGE} = ChatApi;
export const getFriendList = async () => {
    try{
        const response = await axios.get(GET_FRIEND_LIST, {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        })

        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}

export const getChat = async (friendId: number) => {
    try{
        const response = await axios.post(GET_CHAT, {
            friendId
        }, {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        })

        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}

export const sendMessage = async (isReply:boolean, replyMsgId: number, receiverId: string, content: string) => {
    try{
        const response = await axios.post(SEND_MESSAGE, {
            isReply,
            replyMsgId,
            receiverId,
            content
        }, {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        })

        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}

export const deleteChat = async (friendId: string) => {
    try{
        const response = await axios.post(DELETE_CHAT, {
            friendId
        }, {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        })

        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}

export const deleteMessage = async (messageId: number) => {
    try{
        const response = await axios.post(DELETE_MESSAGE, {
            messageId
        }, {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        })

        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}