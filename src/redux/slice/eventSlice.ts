import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    refreshFriendList: false,
    refreshChat: false
}

const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        setRefreshFriendList: (state, action) => {
            state.refreshFriendList = action.payload
        },
        setRefreshChat: (state, action) => {
            state.refreshChat = action.payload
        }
    }
})

export const { setRefreshFriendList, setRefreshChat } = eventSlice.actions;
export default eventSlice.reducer;