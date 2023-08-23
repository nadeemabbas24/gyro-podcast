import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  episode: [],
};

const episodeSlice = createSlice({
  name: "episode",
  initialState,
  reducers: {
    setEpisode: (state, action) => {
      state.episode = action.payload;
    },
    clearEpisode: (state) => {
      state.episode = [];
    },
  },
});
export const { setEpisode, clearEpisode } = episodeSlice.actions;
export default episodeSlice.reducer;
