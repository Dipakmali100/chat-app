import axios from "axios";
import { ConnectionApi } from "../apis";

const {SEARCH_USER, CONNECT, DISCONNECT} = ConnectionApi;

export const searchUser = async (searchedUsername: string) => {
    try{
        const response = await axios.post(SEARCH_USER, {
            searchedUsername
        },{
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        });

        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}

export const connectUser = async (secondUserId: number) => {
    try{
        const response = await axios.post(CONNECT, {
            secondUserId
        },{
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        });

        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}

export const disconnectUser = async (friendId: number, isDeleteChat: boolean) => {
    try{
        const response = await axios.post(DISCONNECT, {
            friendId,
            isDeleteChat
        },{
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        });

        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}