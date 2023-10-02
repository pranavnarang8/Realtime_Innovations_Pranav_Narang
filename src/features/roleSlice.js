import { createSlice } from "@reduxjs/toolkit";

export const roleSlice = createSlice({
    name:"role",
    initialState:{
        options:false,
        role:"",
        profile:null,
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
            state.role = null;
        },
        setProfile: (state) => {
            state.profile = " "
        },
        resetProfile: (state) => {
            state.profile = null
        }
    }
})

export const {openOptions, closeOptions, chooseRole, removeRole, setProfile, resetProfile} = roleSlice.actions;

export const selectOptions = state => state.role.options;
export const selectRole = state => state.role.role;
export const selectProfile = state => state.role.profile;

export default roleSlice.reducer;