import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    Name: "Miguel Teixeira",
    Num_Mecan: 100402,
  },
});

export default userSlice.reducer;
