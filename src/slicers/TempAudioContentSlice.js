import { createSlice } from '@reduxjs/toolkit';

const TempAudioContentSlice = createSlice({
  name: 'TempAudioContentSlice',
  initialState: {
    title: '',
    original_content_category: '',
    original_content_language: '',
    description: '',
    created_content_language: '',
    sections: [],
    activeSectionId: undefined,
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
    setAudioFormsReset: (state) => {
      state.title = '';
      state.original_content_category = '';
      state.original_content_language = '';
      state.description = '';
      state.created_content_language = '';
      state.sections = [];
    },
    addSection: (state, action) => {
      state.sections.push(action.payload);
    },
    updateSectionTitle: (state, action) => {
      const { title, description, startTime, endTime } = action.payload;
      const sectionIndex = state.sections.findIndex((section) => section.id === state.activeSectionId);
      if (sectionIndex !== -1) {
        state.sections[sectionIndex] = {
          ...state.sections[sectionIndex],
          title,
          description,
          startTime,
          endTime,
        };
      }
    },
    removeSection: (state) => {
      state.sections = state.sections.filter((section) => section.id !== state.activeSectionId);
    },
    setActiveSectionId: (state, action) => {
      state.activeSectionId = action.payload;
    },
  },
  selectors: {
    selectActiveSection: (
      state, // devolve um objeto com a info da secção selecionada, a partir do ID guardado no estado
    ) => state.activeSectionId !== undefined && state.sections.find((section) => section.id === state.activeSectionId),
  },
});

export const { setTitle, setOriginalContentCategory, setOriginalContentLanguage, setDescription, setCreatedContentLanguage, setAudioFormsReset, addSection, updateSectionTitle, removeSection, setActiveSectionId } = TempAudioContentSlice.actions;

export const { selectActiveSection } = TempAudioContentSlice.selectors;

export default TempAudioContentSlice.reducer;
