import { createSlice } from "@reduxjs/toolkit";

export const employeeSlice = createSlice({
    name:"employee",
    initialState:{
        list:null,
        employee:null,
        delete:false,
    },
    reducers:{
        setList : (state, action) => {
            state.list = action.payload
        },
        setEmployee : (state,action) => {
            state.employee = action.payload
        },
        unsetEmployee: (state) => {
            state.employee = null;
        },
        setDeleteDialog: (state) => {
            state.delete = true;
        },
        resetDeleteDialog: (state) => {
            state.delete = false;
        }
    

    }
})

export const {setList, setEmployee, unsetEmployee, setDeleteDialog, resetDeleteDialog} = employeeSlice.actions;

export const selectList = state => state.employee.list;
export const selectEmployee = state => state.employee.employee;
export const selectDeleteDialog = state => state.employee.delete;

export default employeeSlice.reducer;