import React, { useEffect, useState } from 'react';
import "./AddEmp.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { selectRole } from '../features/roleSlice';
import { chooseRole, openOptions, removeRole } from '../features/roleSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { selectEmployee, selectList, unsetEmployee } from '../features/employeeSlice';

const AddEmp = ({idb}) => {
    const [name, setName] = useState("");
    const [tDate, setTDate] = useState(null)
    const [fDate, setFDate] = useState(null)
    const [tPicker, setTPicker] = useState(false)
    const [fPicker, setFPicker] = useState(false)
    const [data, setData] = useState([])
    const employee = useSelector(selectEmployee)
    const role = useSelector(selectRole);
    const [profile, setProfile] = useState("")
    const dispatch = useDispatch()


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

    const handleChange = (newValue) => {
      if(tPicker){
        setTDate(newValue);
        setTPicker(false)
        }
        if(fPicker){
            setFDate(newValue)
            setFPicker(false)
        }
    }

    const handleOptions = () => {
      dispatch(openOptions())
    }

    const handleCancel = () => {
        setName("");
        dispatch(unsetEmployee())
        dispatch(removeRole())
        setTDate(null);
        setFDate(null)
    }

    const handleAddition = () => {
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
        setTDate(null);
        setFDate(null)
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
    },[employee])

  return (
    <>
    <div className='addEmp'>
      <div className='addEmp__desktop'>
        <div className="addEmp__container">
      <div className="addEmp__nameInput">
        <PersonOutlineOutlinedIcon/>
        <input type="text" placeholder='Employee Name' value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="addEmp__roleInput">
        <WorkOutlineOutlinedIcon/>
        <input type="text" value={role?.profile === "" ? profile : role?.profile} onChange={() => dispatch(removeRole())} placeholder='Employee Role' />
        <ArrowDropDownOutlinedIcon onClick={handleOptions}/>
      </div>
        <div className="addEmp__dateInput">
            <input type="text" placeholder="From" value={fDate?.toDateString().substring(4,15)} />
            <InsertInvitationOutlinedIcon onClick={() => setFPicker(true)}/>
        </div>
        <div className="addEmp__dateInput">
            <input type="text" placeholder="To" value = {tDate?.toDateString().substring(4,15)} />
            <InsertInvitationOutlinedIcon onClick={() => setTPicker(true)}/>
        </div>
    </div>
    <div className="addEmp__actions">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleAddition}>Save</button>
    </div>
    </div>
    </div>

{(tPicker || fPicker) && 
<div className="addEmp__pickerContainer">
<div className='addEmp__datePicker'>
<div className="addEmp__pickerBtn">
    <button onClick={onSelectToday}>Today</button>
    <button onClick={onSelectMonday}>Next Monday</button>
</div>
<div className="addEmp__pickerBtn">
    <button onClick={onSelectTuesday}>Next Tuesday</button>
    <button onClick={onSelectNextWeek}>After 1 week</button>
</div>
<LocalizationProvider dateAdapter={AdapterDateFns}>
{tPicker && <DateCalendar value={tDate ? tDate : new Date()} onChange={(newValue) => handleChange(newValue)}/>}
{fPicker && <DateCalendar value={fDate ? fDate : new Date()} onChange={(newValue) => handleChange(newValue)}/>}
</LocalizationProvider>
</div>
</div>}
</>
  )
}

export default AddEmp