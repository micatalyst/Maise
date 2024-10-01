import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import Data from '@/Data/Data';

export const fetchContent = createAsyncThunk('data/fetchContent', async () => {
  try {
    const url = `${window.location.protocol}//${window.location.hostname}:3001/content`;
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } catch (e) {
    console.error('Could not get content:', e);
  }
});

export const fetchContentById = createAsyncThunk('data/fetchContentById', async (id) => {
  try {
    const url = `${window.location.protocol}//${window.location.hostname}:3001/content/${id}`;
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } catch (e) {
    console.error('Could not get content by id:', e);
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    // data: Data,
    data: [],
    currentContent: null,
    loading: false,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    addItem: (state, action) => {
      state.data.push(action.payload);
    },
    updateItem: (state, { payload }) => {
      const { id } = payload;
      const index = state.data.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.data[index] = payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Sem estes extraReducers o thunk de cima que faz a chamada à API nem sequer funciona
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchContent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchContentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContentById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentContent = payload;
      })
      .addCase(fetchContentById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setData, addItem, updateItem } = dataSlice.actions;
export default dataSlice.reducer;
