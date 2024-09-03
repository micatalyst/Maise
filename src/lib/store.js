import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "@/slicers/dataSlice";
import userReducer from "@/slicers/userSlice";

const store = configureStore({
  reducer: {
    dataSlice: dataReducer,
    userSlice: userReducer,
  },
});

export default store;
