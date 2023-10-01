import { createSlice } from "@reduxjs/toolkit";

export const employeeSlice = createSlice({
    name:"employee",
    initialState:{
        list:null,
        employee:null,
    },
    reducers:{
        setList : (state, action) => {
            state.list = action.payload
        },
        setEmployee : (state,action) => {
            state.employee = action.payload
        }
    }
})

export const {setList, setEmployee} = employeeSlice.actions;

export const selectList = state => state.employee.list;
export const selectEmployee = state => state.employee.employee

export default employeeSlice.reducer;