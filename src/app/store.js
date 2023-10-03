import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import dateReducer from '../features/dateSlice';
import roleReducer from '../features/roleSlice';
import employeeReducer from "../features/employeeSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    role: roleReducer,
    employee: employeeReducer,
  },

  middleware:(getDefaultMiddleware) =>{
    return getDefaultMiddleware({
     serializableCheck:{
        ignoredActions:["employee/setEmployee", "role/resetProfile", "role/chooseRole"]
      }
    })
  }
});
