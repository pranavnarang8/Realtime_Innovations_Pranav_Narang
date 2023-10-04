import { createSlice } from "@reduxjs/toolkit";

export const dateSlice = createSlice({
    name:"date",
    initialState:{
        picker:false
    },
    reducers:{
        openDatePicker : (state) => {
            state.picker = true
        },
        closeDatePicker: (state) => {
            state.picker = false;
        }
    }
})

export const {openDatePicker, closeDatePicker} = dateSlice.actions;

export const selectPicker = state => state.date.picker;

export default dateSlice.reducer;

