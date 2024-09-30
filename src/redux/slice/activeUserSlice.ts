import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    friendId: 0,
    username: ""
}

const activeUserSlice = createSlice({
    name: "activeUser",
    initialState,
    reducers: {
        setActiveUser: (state, action) => {
            state.friendId = action.payload.friendId
            state.username = action.payload.username
        }
    }
})

export const { setActiveUser } = activeUserSlice.actions;
export default activeUserSlice.reducer;