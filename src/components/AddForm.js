import React, { useEffect, useState } from 'react';
import "./AddForm.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import { useDispatch , useSelector } from 'react-redux';
import { closeDatePicker, openDatePicker, selectPicker } from '../features/dateSlice';
import { chooseRole, openOptions, removeRole, selectRole } from '../features/roleSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { selectEmployee, selectList, unsetEmployee } from '../features/employeeSlice';


const AddForm = () => {
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
    const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ;

    const handleOptions = () =>{
        dispatch(openOptions())
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
            console.log(employee.fromDate)
            setFDate(employee.fromDate)
            setTDate(employee.toDate)
            
        }
      },[])

  return (
    <>
    <div className='addForm__mobile'>
      <div className="addForm__nameInput">
        <PersonOutlineOutlinedIcon/>
        <input type="text" placeholder='Employee Name' value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="addForm__roleInput">
        <WorkOutlineOutlinedIcon/>
        <input type="text" value={role.profile} placeholder='Employee Role' />
        <ArrowDropDownOutlinedIcon onClick={handleOptions}/>
      </div>
      <div className="addForm__datePickers">
        <div className="addForm__dateInput">
            <input type="text" value={fDate?.toDateString().substring(4,15)} />
            <InsertInvitationOutlinedIcon onClick={() => setFPicker(true)}/>
        </div>
        <div className="addForm__dateInput">
            <input type="text" value = {tDate?.toDateString().substring(4,15)} />
            <InsertInvitationOutlinedIcon onClick={() => setTPicker(true)}/>
        </div>
      </div>
    </div>
    
   <div className="addForm__actions">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleAddition}>Save</button>
    </div>

    {/* changes made for Date Picker */}
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

export default AddForm
