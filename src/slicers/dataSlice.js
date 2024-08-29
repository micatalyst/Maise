import { createSlice } from "@reduxjs/toolkit";
import Data from "@/Data/Data";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: Data,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    addItem: (state, action) => {
      state.data.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.data.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
});

export const { setData, addItem, updateItem } = dataSlice.actions;
export default dataSlice.reducer;
