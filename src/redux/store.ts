import { configureStore } from "@reduxjs/toolkit";
import activeUserSlice from "./slice/activeUserSlice";
import eventSlice from "./slice/eventSlice";


const store = configureStore({
    reducer: {
        activeUser: activeUserSlice,
        event: eventSlice
    }
})

export default store;