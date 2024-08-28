import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "@/slicers/dataSlice";

const store = configureStore({
  reducer: {
    dataSlice: dataReducer,
  },
});

export default store;
