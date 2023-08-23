import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  podcasts: [],
};

const podcastSlice = createSlice({
  name: "podcasts",
  initialState,
  reducers: {
    setPodcast: (state, action) => {
      state.podcasts = action.payload;
    },
    clearPodcast: (state) => {
      state.podcasts = [];
    },
  },
});
export const { setPodcast, clearPodcast } = podcastSlice.actions;
export default podcastSlice.reducer;
