import React, { useEffect, useState } from 'react';
import "./AddEmp.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { closeOptions, selectOptions, selectProfile, selectRole, setProfile } from '../features/roleSlice';
import { chooseRole, openOptions, removeRole } from '../features/roleSlice';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { selectEmployee, setList, unsetEmployee } from '../features/employeeSlice';

const AddEmp = ({idb}) => {
    const [name, setName] = useState("");
    const [tDate, setTDate] = useState(null);
    const [fDate, setFDate] = useState(null);
    const [tPicker, setTPicker] = useState(false);
    const [fPicker, setFPicker] = useState(false);
    const [data, setData] = useState([]);
    const employee = useSelector(selectEmployee);
    const role = useSelector(selectRole);
    const profile = useSelector(selectProfile);
    const dispatch = useDispatch();
    const option = useSelector(selectOptions);

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
      if(!option){
        dispatch(openOptions())
      }else{
        dispatch(closeOptions())
      }
      
    }

    const handleCancel = () => {
        setName("");
        dispatch(unsetEmployee());
        setTDate(null)
        setFDate(null);
        dispatch(setProfile());
    }

    const handleAddition = () => {
      if(tDate){
        if(tDate.getTime() < fDate.getTime()){
          alert("Please enter a valid 'To' date")
          return;
        }
      }
      const dbPromise = idb.open("employee-db",1)
        if(name && role && fDate){
          if(role.profile == "Product Design" || "Flutter Developer" || "QA Tester" || "Product Owner"){
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
                  db.close();
                }
              }
      
              employees.onerror = (error) =>{
                alert("Error with Indexed DB here",error)
              }
            }
          }else{
            alert("Please Select a role from the listed ones");
            return;
          }
          
        }else{
            alert("Please fill in the mandatory Parameters")
        }
        setName("");
        dispatch(setList(false))
        dispatch(unsetEmployee())
        dispatch(removeRole())
        setTDate(null);
        setFDate(null);
        dispatch(setProfile());
    }

    const handleFDate = () =>{
      if(tPicker){
        setTPicker(false)
      }
      setFPicker(true)
    }

    const handleTDate = () =>{
      if(fPicker){
        setFPicker(false)
      }
      setTPicker(true)
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
          setFDate(employee.fromDate);
          setTDate(employee.toDate); 
      }
    },[employee])

  return (
    <>
    <div className={`addEmp`}>
      <div className='addEmp__desktop'>
        <div className="addEmp__container">
      <div className="addEmp__nameInput">
        <PersonOutlineOutlinedIcon/>
        <input type="text" placeholder='Employee Name *' value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="addEmp__roleInput">
        <WorkOutlineOutlinedIcon/>
        <input type="text" value={profile ? "" : role?.profile} onChange={() => dispatch(removeRole())} placeholder='Select Role *' />
        <ArrowDropDownOutlinedIcon onClick={handleOptions}/>
      </div>
        <div className="addEmp__dateInput">
            <input type="text" placeholder="From *" value={fDate?.toDateString() ? fDate?.toDateString().substring(4,15) : ""} onChange={()=>setFDate(null)}/>
            <InsertInvitationOutlinedIcon onClick={handleFDate}/>
        </div>
        <div className="addEmp__dateInput">
            <input type="text" placeholder="To" value={tDate?.toDateString() ? tDate?.toDateString().substring(4,15) : ""} onChange={()=>setTDate(null)} />
            <InsertInvitationOutlinedIcon onClick={handleTDate}/>
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
{fPicker && <><div className="addEmp__pickerBtn">
    <button onClick={onSelectToday}>Today</button>
    <button onClick={onSelectMonday}>Next Monday</button>
</div>
<div className="addEmp__pickerBtn">
    <button onClick={onSelectTuesday}>Next Tuesday</button>
    <button onClick={onSelectNextWeek}>After 1 week</button>
</div></>}
{
  tPicker &&  <div className="addEmp__pickerBtn">
  <button onClick={()=>setTPicker(false)}>No Date</button>
  <button onClick={onSelectToday}>Today</button>
</div>
}
<LocalizationProvider dateAdapter={AdapterDateFns}>
{tPicker && <StaticDatePicker onClose={()=>setTPicker(false)} value={tDate ? tDate : new Date()} onAccept={(newValue) => handleChange(newValue)}/>}
{fPicker && <StaticDatePicker onClose={()=>setFPicker(false)} value={fDate ? fDate : new Date()} onAccept={(newValue) => handleChange(newValue)}/>}
</LocalizationProvider>
</div>
</div>}
</>
  )
}

export default AddEmp
