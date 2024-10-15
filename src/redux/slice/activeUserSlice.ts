import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    friendId: 0,
    username: "",
    imgUrl: ""
}

const activeUserSlice = createSlice({
    name: "activeUser",
    initialState,
    reducers: {
        setActiveUser: (state, action) => {
            state.friendId = action.payload.friendId
            state.username = action.payload.username
            state.imgUrl = action.payload.imgUrl
        }
    }
})

export const { setActiveUser } = activeUserSlice.actions;
export default activeUserSlice.reducer;