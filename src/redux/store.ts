import { configureStore } from "@reduxjs/toolkit";
import activeUserSlice from "./slice/activeUserSlice";


const store = configureStore({
    reducer: {
        activeUser: activeUserSlice
    }
})

export default store;