import React, { useEffect, useState } from 'react';
import "./AddForm.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useDispatch , useSelector } from 'react-redux';
import { chooseRole, closeOptions, openOptions, removeRole, selectOptions, selectRole } from '../features/roleSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import {StaticDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { selectEmployee, unsetEmployee } from '../features/employeeSlice';


const AddForm = ({idb}) => {
    const [name, setName] = useState("");
    const [tDate, setTDate] = useState(null)
    const [fDate, setFDate] = useState(null)
    const [tPicker, setTPicker] = useState(false)
    const [fPicker, setFPicker] = useState(false)
    const [data,setData] = useState([])
    const role = useSelector(selectRole);
    const employee = useSelector(selectEmployee)
    const history = useHistory();
    const dispatch = useDispatch();
    const option = useSelector(selectOptions)

    const handleOptions = () =>{
      if(!option){
        dispatch(openOptions())
      }else{
        dispatch(closeOptions())
      }
    }

    const onSelectToday = () =>{
      handleChange(new Date())
    }

    const onSelectMonday = () =>{
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const daysUntilMonday = 7 - currentDay + 1;
      const nextMondayDate = new Date();
      nextMondayDate.setDate(currentDate.getDate() + daysUntilMonday);
      handleChange(nextMondayDate)
    }

    const onSelectTuesday = () =>{
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const daysUntilTuesday = 7 - currentDay + 2;
      const nextTuesdayDate = new Date();
      nextTuesdayDate.setDate(currentDate.getDate() + daysUntilTuesday);
      handleChange(nextTuesdayDate)
    }

    const onSelectNextWeek = () =>{
      const currentDate = new Date()
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      handleChange(nextWeek)
    }

    const handleChange = (newValue) =>{
        if(tPicker){
        setTDate(newValue);
        setTPicker(false)
        }
        if(fPicker){
            setFDate(newValue)
            setFPicker(false)
        }
    }


    const handleCancel = () => {
        setName("");
        dispatch(unsetEmployee())
        dispatch(removeRole())
        history.push("/")
    }


    const handleAddition = () => {
      if(tDate){
        if(tDate.getTime() < fDate.getTime()){
          alert("To date cannot be greater than From date")
          return;
        }
      }
        const dbPromise = idb.open("employee-db",1)
        if(name && role && fDate){
          dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const tx = db.transaction("employeeData","readwrite");
            const employeeData = tx.objectStore("employeeData");
            let employees;
            if(!employee){
                employees = employeeData.put({
                    id: name.substring(0,4) + data.length+1,
                    name: name,
                    role: role.profile,
                    fromDate: fDate.toUTCString(),
                    toDate: tDate?.toUTCString(),
                  })
            }else{
                employees = employeeData.put({
                    id: employee.id,
                    name: name,
                    role: role.profile,
                    fromDate: fDate.toUTCString(),
                    toDate: tDate?.toUTCString(),
                  })
            }
            
    
            employees.onsuccess = () => {
              tx.oncomplete = () => {
                db.close()
              }
            }
    
            employees.onerror = (error) =>{
              alert("Error with Indexed DB here",error)
            }
          }
        }else{
            alert("Please fill in the mandatory Parameters")
        }
        setName("");
        dispatch(unsetEmployee())
        dispatch(removeRole())
        history.push("/")
      }

      useEffect(()=>{
        const fetchEmployees = () =>{
            const dbPromise = idb.open("employee-db",1)
        
            dbPromise.onsuccess = () => {
              const db = dbPromise.result;
              const tx = db.transaction("employeeData","readonly");
              const employeeData = tx.objectStore("employeeData");
              let employees = employeeData.getAll();
              employees.onsuccess = (query) => {
                let res = query.srcElement.result
                setData(res);
              }
        
              employees.onerror = (error) => {
                alert("Error with the fetch request", error)
              }
        
              tx.oncomplete = () => {
                db.close();
              }
          }
        }
        fetchEmployees();

        if(employee){
            setName(employee.name);
            dispatch(chooseRole({
                profile: employee.role
            }))
            setFDate(employee.fromDate)
            setTDate(employee.toDate)
            
        }
      },[])

  return (
    <>
    <div className='addForm__mobile'>
      <div className="addForm__nameInput">
        <PersonOutlineOutlinedIcon/>
        <input type="text" placeholder='Employee Name *' value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="addForm__roleInput">
        <WorkOutlineOutlinedIcon/>
        <input type="text" value={role?.profile} placeholder='Select Role *' onChange={() => dispatch(removeRole())} />
        <ArrowDropDownOutlinedIcon onClick={handleOptions}/>
      </div>
      <div className="addForm__datePickers">
        <div className="addForm__dateInput">
            <input type="text" placeholder="From *" value={fDate?.toDateString().substring(4,15)} onChange={()=>setFDate(null)}/>
            <InsertInvitationOutlinedIcon onClick={() => setFPicker(true)}/>
        </div>
        <ArrowRightAltIcon/>
        <div className="addForm__dateInput">
            <input type="text" placeholder="To" value = {tDate?.toDateString().substring(4,15)} onChange={()=>setTDate(null)}/>
            <InsertInvitationOutlinedIcon onClick={() => setTPicker(true)}/>
        </div>
      </div>
    </div>
    
   <div className="addForm__actions">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleAddition}>Save</button>
    </div>

    
    {(tPicker || fPicker) &&<div className='addForm__pickerContainer'> <div className='addForm__datePicker'>
        {fPicker && <><div className="addForm__pickerBtn">
            <button onClick={onSelectToday}>Today</button>
            <button onClick={onSelectMonday}>Next Monday</button>
        </div>
        <div className="addForm__pickerBtn">
            <button onClick={onSelectTuesday}>Next Tuesday</button>
            <button onClick={onSelectNextWeek}>After 1 week</button>
        </div> </> } 
        {tPicker && <div className="addForm__pickerBtn">
            <button onClick={() => setTPicker(false)}>No Date</button>
            <button onClick={onSelectToday}>Today</button>
        </div>}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        {tPicker && <StaticDatePicker onClose={()=>setTPicker(false)} value={tDate ? tDate : new Date()} onAccept={(newValue) => handleChange(newValue)}/>}
        {fPicker && <StaticDatePicker onClose={()=>setFPicker(false)} value={fDate ? fDate : new Date()} onAccept={(newValue) => handleChange(newValue)}/>} 
        </LocalizationProvider>
    </div> </div>}
    </>
  )
}

export default AddForm
