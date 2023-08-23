import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import podcastReducer from "./slices/podcastSlice";
import episodeReducer from "./slices/episodeSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    podcast: podcastReducer,
    episode: episodeReducer,
  },
});
