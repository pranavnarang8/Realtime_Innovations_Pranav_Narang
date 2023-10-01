import { createSlice } from "@reduxjs/toolkit";

export const roleSlice = createSlice({
    name:"role",
    initialState:{
        options:false,
        role:"",
    },
    reducers:{
        openOptions : (state) => {
            state.options = true
        },
        closeOptions: (state) => {
            state.options = false;
        },
        chooseRole: (state,action) => {
            state.role = action.payload;
        },
        removeRole: (state) => {
            state.role = "";
        }
    }
})

export const {openOptions, closeOptions, chooseRole, removeRole} = roleSlice.actions;

export const selectOptions = state => state.role.options;
export const selectRole = state => state.role.role;

export default roleSlice.reducer;