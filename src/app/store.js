import { configureStore } from '@reduxjs/toolkit';
import dateReducer from '../features/dateSlice';
import roleReducer from '../features/roleSlice'

export const store = configureStore({
  reducer: {
    date: dateReducer,
    role: roleReducer,
  },
});
