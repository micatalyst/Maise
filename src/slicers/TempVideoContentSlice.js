import { createSlice } from '@reduxjs/toolkit';

const TempVideoContentSlice = createSlice({
  name: 'TempVideoContentSlice',
  initialState: {
    title: '',
    original_content_category: '',
    original_content_language: '',
    description: '',
    created_content_language: '',
    videoSubtitles: [],
    onEditingSubtitleId: undefined,
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setOriginalContentCategory: (state, action) => {
      state.original_content_category = action.payload;
    },
    setOriginalContentLanguage: (state, action) => {
      state.original_content_language = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setCreatedContentLanguage: (state, action) => {
      state.created_content_language = action.payload;
    },
    setVideoFormsReset: (state) => {
      state.title = '';
      state.original_content_category = '';
      state.original_content_language = '';
      state.description = '';
      state.created_content_language = '';
      state.videoSubtitles = [];
    },
    addVideoSubtitle: (state, action) => {
      state.videoSubtitles.push(action.payload);
    },
    updateVideoSubtitle: (state, action) => {
      const { id, startTime, endTime, text } = action.payload;
      const videoSubtitleIndex = state.videoSubtitles.findIndex((videoSubtitles) => videoSubtitles.id === id);
      if (videoSubtitleIndex !== -1) {
        state.videoSubtitles[videoSubtitleIndex] = {
          ...state.videoSubtitles[videoSubtitleIndex],
          startTime,
          endTime,
          text,
        };
      }
    },
    removeVideoSubtitle: (state, action) => {
      const id = action.payload;

      // Remove
      state.videoSubtitles = state.videoSubtitles.filter((section) => section.id !== id);
    },
    setOnEditingSubtitleId: (state, action) => {
      state.onEditingSubtitleId = action.payload;
    },
  },
});

export const { setTitle, setOriginalContentCategory, setOriginalContentLanguage, setDescription, setCreatedContentLanguage, setVideoFormsReset, addVideoSubtitle, updateVideoSubtitle, removeVideoSubtitle, setOnEditingSubtitleId } = TempVideoContentSlice.actions;

export default TempVideoContentSlice.reducer;
