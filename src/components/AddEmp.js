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

const AddEmp = () => {
    const [name, setName] = useState("");
    const [tDate, setTDate] = useState(null)
    const [fDate, setFDate] = useState(null)
    const [tPicker, setTPicker] = useState(false)
    const [fPicker, setFPicker] = useState(false)
    const [data, setData] = useState([])
    const employee = useSelector(selectEmployee)
    const role = useSelector(selectRole);
    const dispatch = useDispatch()

    const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB

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
                    id: data.length+1,
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
          console.log(employee.fromDate)
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
        <input type="text" value={role?.profile} placeholder='Employee Role' />
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

{(tPicker || fPicker) && <div className='addForm__datePicker'>
<div className="addForm__pickerBtn">
    <button>Today</button>
    <button>Next Monday</button>
</div>
<div className="addForm__pickerBtn">
    <button>Next Tuesday</button>
    <button>After 1 week</button>
</div>
<LocalizationProvider dateAdapter={AdapterDateFns}>
{tPicker && <DateCalendar value={tDate ? tDate : new Date()} onChange={(newValue) => handleChange(newValue)}/>}
{fPicker && <DateCalendar value={fDate ? fDate : new Date()} onChange={(newValue) => handleChange(newValue)}/>}
</LocalizationProvider>
</div>}
</>
  )
}

export default AddEmp
