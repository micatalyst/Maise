import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '@/slicers/dataSlice';
import userReducer from '@/slicers/userSlice';
import TempTextContentReducer from '@/slicers/TempTextContentSlice';
import TempImageContentReducer from '@/slicers/TempImageContentSlice';
import TempAudioContentReducer from '@/slicers/TempAudioContentSlice';
import TempVideoContentReducer from '@/slicers/TempVideoContentSlice';

const store = configureStore({
  reducer: {
    dataSlice: dataReducer,
    userSlice: userReducer,
    TempTextContentSlice: TempTextContentReducer,
    TempImageContentSlice: TempImageContentReducer,
    TempAudioContentSlice: TempAudioContentReducer,
    TempVideoContentSlice: TempVideoContentReducer,
  },
});

export default store;
