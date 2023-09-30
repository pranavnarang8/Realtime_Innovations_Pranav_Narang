import React, { useEffect, useState } from 'react';
import "./AddForm.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import { useDispatch , useSelector } from 'react-redux';
import { closeDatePicker, openDatePicker, selectPicker } from '../features/dateSlice';
import { DateCalendar } from '@mui/x-date-pickers';
import { openOptions, selectRole } from '../features/roleSlice';


const AddForm = () => {
    const [name, setName] = useState(null);
    const [tDate, setTDate] = useState(null)
    const dispatch = useDispatch();
    const picker = useSelector(selectPicker);
    const role = useSelector(selectRole)

    const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ;


    const handleOptions = () =>{
        dispatch(openOptions())
    }

    const handlePicker = () =>{
        dispatch(openDatePicker());
    }

    const handleChange = (newValue) =>{
        console.log(newValue.$D + "")
        setTDate(newValue.$D);
        dispatch(closeDatePicker())
    }

    const createEmployee = () =>{
        if(!idb){
          alert("This browser doesn't support Indexed DB");
          return;
        }else{
          const request = idb.open('employee-db', 1)

          request.onerror = (error) =>{
            alert("Error with Indexed DB ",error)
          }

          request.onupgradeneeded = () => {
            const db = request.result;
            if(!db.objectStoreNames.contains('employeeData')){
              db.createObjectStore('employeeData', {
                keyPath:"id"
              })
            }
          }

          request.onsuccess = () => {
            console.log("Indexed DB created successfully")
          }
        }
      }

    const handleAddition = () => {
        const dbPromise = idb.open("employee-db",1)
        if(name && role){
          dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const tx = db.transaction("employeeData","readwrite");
            const employeeData = tx.objectStore("employeeData");
            const employees = employeeData.add({
              id:1,
              name: name,
              role: role.profile,
            })
    
            employees.onsuccess = () => {
              tx.oncomplete = () => {
                db.close()
              }
              alert("Employee Added")
            }
    
            employees.onerror = (error) =>{
              alert("Error with Indexed DB here",error)
            }
          }
        }
      }

      useEffect(()=>{
        createEmployee()
      },[])
  return (
    <>
    <div className='addForm__mobile'>
      <div className="addForm__nameInput">
        <PersonOutlineOutlinedIcon/>
        <input type="text" placeholder='Employee Name' onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="addForm__roleInput">
        <WorkOutlineOutlinedIcon/>
        <input type="text" value={role.profile} placeholder='Developer Role' />
        <ArrowDropDownOutlinedIcon onClick={handleOptions}/>
      </div>
      <div className="addForm__datePickers">
        <div className="addForm__dateInput">
            <input type="text" value={tDate} />
            <InsertInvitationOutlinedIcon onClick={handlePicker}/>
        </div>
        <div className="addForm__dateInput">
            <input type="text" />
            <InsertInvitationOutlinedIcon/>
        </div>
      </div>
    </div>
    
   <div className="addForm__actions">
        <button>Cancel</button>
        <button onClick={handleAddition}>Save</button>
    </div>

    {/* changes made for Date Picker */}
    {picker && <div className='datePicker__mobile'>
        <div className="datePicker__btnRows">
            <button>Today</button>
            <button>Next Monday</button>
        </div>
        <div className="datePicker__btnRows">
            <button>Next Tuesday</button>
            <button>After 1 week</button>
        </div>
        <DateCalendar value={tDate} onChange={(newValue) => handleChange(newValue)} />
    </div>}
    </>
  )
}

export default AddForm
