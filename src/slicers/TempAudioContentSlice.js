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
      //state.sections.push({ ...action.payload, description: "hey" });
      state.sections.push(action.payload);
    },
    updateSectionTitle: (state, action) => {
      const { id, title } = action.payload;
      const sectionIndex = state.sections.findIndex((section) => section.id === id);
      if (sectionIndex !== -1) {
        state.sections[sectionIndex] = {
          ...state.sections[sectionIndex],
          title,
        };
      }
    },
    removeSection: (state, action) => {
      const id = action.payload;

      // Get the index before deleting
      const index = state.sections.findIndex((section) => section.id === id);

      // Remove
      state.sections = state.sections.filter((section) => section.id !== id);

      // Select previous or next section
      // if deleting the first one (index 0), select the next (goes to index 0)
      // if deleting the second (index 1), select the previous (index 0)
      if (state.sections.length) {
        const newSelectedSectionIndex = index === 0 ? 0 : index - 1;
        state.activeSectionId = state.sections[newSelectedSectionIndex].id;
      }
    },
    setReorderedSections: (state, action) => {
      state.sections = action.payload;
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

export const { setTitle, setOriginalContentCategory, setOriginalContentLanguage, setDescription, setCreatedContentLanguage, setAudioFormsReset, addSection, updateSectionTitle, removeSection, setReorderedSections, setActiveSectionId } = TempAudioContentSlice.actions;

export const { selectActiveSection } = TempAudioContentSlice.selectors;

export default TempAudioContentSlice.reducer;
