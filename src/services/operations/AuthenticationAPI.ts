import axios from "axios";
import { AuthenticationApi } from "../apis";

const {REGISTER_API, LOGIN_API, UNIQUE_USERNAME_CHECK_API} = AuthenticationApi;

export const registerApi = async (username: string, password: string, imgUrl: string) => {
    try{
        
        const response = await axios.post(REGISTER_API, {
            username,
            password,
            imgUrl
        })
    
        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}
export const loginApi = async (username: string, password: string) => {
    try{
        const response = await axios.post(LOGIN_API, {
            username,
            password
        })
    
        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}

export const uniqueUsernameCheck = async (username: string) => {
    try{
        const response = await axios.post(UNIQUE_USERNAME_CHECK_API, {
            username
        })
    
        return response.data;
    }catch(err){
        console.error(err);
        return {success: false, message: "Something went wrong"};
    }
}