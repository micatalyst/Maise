import { createSlice } from '@reduxjs/toolkit';

const TempVideoContentSlice = createSlice({
  name: 'TempVideoContentSlice',
  initialState: {
    title: '',
    original_content_category: '',
    original_content_language: '',
    description: '',
    subtitle_created_language: '',
    videoSubtitles: [],
    activeSubtitleId: undefined,
    activeSubtitleCueId: undefined,
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
    setSubtitleCreatedLanguage: (state, action) => {
      state.subtitle_created_language = action.payload;
    },
    setVideoFormsReset: (state) => {
      state.title = '';
      state.original_content_category = '';
      state.original_content_language = '';
      state.description = '';
      state.subtitle_created_language = '';
      state.videoSubtitles = [];
    },
    addVideoSubtitle: (state, action) => {
      state.videoSubtitles.push(action.payload);
    },
    addVideoSubtitleCue: (state, action) => {
      const videoSubtitleIndex = state.videoSubtitles.findIndex((videoSubtitles) => videoSubtitles.id === state.activeSubtitleId);

      if (videoSubtitleIndex !== -1) {
        state.videoSubtitles[videoSubtitleIndex].subtitlesCues.push(action.payload);
      }
    },
    updateVideoSubtitlesLanguage: (state, action) => {
      const { language } = action.payload;
      const videoSubtitleIndex = state.videoSubtitles.findIndex((videoSubtitles) => videoSubtitles.id === state.activeSubtitleId);
      if (videoSubtitleIndex !== -1) {
        state.videoSubtitles[videoSubtitleIndex] = {
          ...state.videoSubtitles[videoSubtitleIndex],
          language,
        };
      }
    },
    updateVideoSubtitleCue: (state, action) => {
      const { startTime, endTime, text, haveTextValue } = action.payload;
      const videoSubtitleIndex = state.videoSubtitles.findIndex((videoSubtitles) => videoSubtitles.id === state.activeSubtitleId);
      const activeVideoSubtitleCueIndex = state.videoSubtitles[videoSubtitleIndex].subtitlesCues.findIndex((subtitle) => subtitle.id === state.activeSubtitleCueId);
      //debugger;
      if (activeVideoSubtitleCueIndex !== -1) {
        state.videoSubtitles[videoSubtitleIndex].subtitlesCues[activeVideoSubtitleCueIndex] = {
          ...state.videoSubtitles[videoSubtitleIndex].subtitlesCues[activeVideoSubtitleCueIndex],
          startTime,
          endTime,
          text,
          haveTextValue,
        };
        //debugger;
      }
    },
    removeAllVideoSubtitles: (state) => {
      // Remove
      state.videoSubtitles = [];
    },
    removeVideoSubtitle: (state) => {
      // Remove
      state.videoSubtitles = state.videoSubtitles.filter((section) => section.id !== state.activeSubtitleId);
    },
    removeVideoSubtitleCue: (state) => {
      // Remove
      const videoSubtitleIndex = state.videoSubtitles.findIndex((videoSubtitles) => videoSubtitles.id === state.activeSubtitleId);
      state.videoSubtitles[videoSubtitleIndex].subtitlesCues = state.videoSubtitles[videoSubtitleIndex].subtitlesCues.filter((subtitleCues) => subtitleCues.id !== state.activeSubtitleCueId);
      //debugger;
    },
    setOnEditingSubtitleId: (state, action) => {
      state.activeSubtitleId = action.payload;
    },
    setOnEditingSubtitleCueId: (state, action) => {
      state.activeSubtitleCueId = action.payload;
    },
  },
  selectors: {
    selectActiveSubtitle: (
      state, // devolve um objeto com a info da secção selecionada, a partir do ID guardado no estado
    ) => state.activeSubtitleId !== undefined && state.videoSubtitles.find((subtitle) => subtitle.id === state.activeSubtitleId),
    /* selectActiveSubtitleCues: (
      state, // devolve o array com a info das subtitlesCues presente no videoSubtitles cujo index é o da subtitles selecionada
    ) => state.activeSubtitleId !== undefined && state.videoSubtitles.find((subtitle) => subtitle.id === state.activeSubtitleId).subtitlesCues, */
  },
});

export const {
  setTitle,
  setOriginalContentCategory,
  setOriginalContentLanguage,
  setDescription,
  setSubtitleCreatedLanguage,
  setVideoFormsReset,
  addVideoSubtitle,
  addVideoSubtitleCue,
  updateVideoSubtitlesLanguage,
  updateVideoSubtitleCue,
  removeAllVideoSubtitles,
  removeVideoSubtitle,
  removeVideoSubtitleCue,
  setOnEditingSubtitleId,
  setOnEditingSubtitleCueId,
} = TempVideoContentSlice.actions;

export const { selectActiveSubtitle, selectActiveSubtitleCues } = TempVideoContentSlice.selectors;

export default TempVideoContentSlice.reducer;
