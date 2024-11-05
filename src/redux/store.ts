import { configureStore } from "@reduxjs/toolkit";
import activeUserSlice from "./slice/activeUserSlice";
import eventSlice from "./slice/eventSlice";

const store = configureStore({
  reducer: {
    activeUser: activeUserSlice,
    event: eventSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific actions or paths
        ignoredActions: ["event/setRefreshFriendList"],
        ignoredPaths: ["event.refreshFriendList"],
      },
    }),
});

export default store;
