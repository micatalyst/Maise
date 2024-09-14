import { createSlice } from "@reduxjs/toolkit";

const TempTextContentSlice = createSlice({
  name: "TempTextContent",
  initialState: {
    TextFormData: {
      title: "",
      description: "",
      content_category: "",
      original_content_language: "",
      created_content_language: "",
      original_content_uploaded: "",
      sections: [],
    },
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setContentCategory: (state, action) => {
      state.content_category = action.payload;
    },
    setOriginalContentLanguage: (state, action) => {
      state.original_content_language = action.payload;
    },
    setCreatedContentLanguage: (state, action) => {
      state.created_content_language = action.payload;
    },
    setOriginalContentUploaded: (state, action) => {
      state.original_content_uploaded = action.payload;
    },
    addSection: (state, action) => {
      const newSection = action.payload;
      state.sections.push(newSection);
    },
    updateSection: (state, action) => {
      const { id, updatedSection } = action.payload;
      const sectionIndex = state.sections.findIndex(
        (section) => section.id === id,
      );
      if (sectionIndex !== -1) {
        state.sections[sectionIndex] = {
          ...state.sections[sectionIndex],
          ...updatedSection,
        };
      }
    },
    removeSection: (state, action) => {
      const id = action.payload;
      state.sections = state.sections.filter((section) => section.id !== id);
    },
  },
});

export const {
  setTitle,
  setDescription,
  setContentCategory,
  setOriginalContentLanguage,
  setCreatedContentLanguage,
  setOriginalContentUploaded,
  addSection,
  updateSection,
  deleteSection,
} = TempTextContentSlice.actions;
export default TempTextContentSlice.reducer;
