import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: 'Miguel Teixeira',
    numMecan: 100402,
  },
});

export default userSlice.reducer;
