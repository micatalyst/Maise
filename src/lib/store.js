import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "@/slicers/dataSlice";
import userReducer from "@/slicers/userSlice";
import TempTextContentReducer from "@/slicers/TempTextContentSlice";

const store = configureStore({
  reducer: {
    dataSlice: dataReducer,
    userSlice: userReducer,
    TempTextContentSlice: TempTextContentReducer,
  },
});

export default store;
