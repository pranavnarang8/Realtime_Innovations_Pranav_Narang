import React, { useState } from 'react';
import "./AddForm.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import { useDispatch , useSelector } from 'react-redux';
import { closeDatePicker, openDatePicker, selectPicker } from '../features/dateSlice';
import { DateCalendar } from '@mui/x-date-pickers';


const AddForm = () => {
    const [name, setName] = useState(null);
    const [role, setRole] = useState(null);
    const [tDate, setTDate] = useState(null)
    const dispatch = useDispatch();
    const picker = useSelector(selectPicker);

    const handlePicker = () =>{
        dispatch(openDatePicker());
    }

    const handleChange = (newValue) =>{
        console.log(newValue.$D + "")
        setTDate(newValue.$D);
        dispatch(closeDatePicker())
    }
  return (
    <>
    <div className='addForm__mobile'>
      <div className="addForm__nameInput">
        <PersonOutlineOutlinedIcon/>
        <input type="text" placeholder='Employee Name' />
      </div>
      <div className="addForm__roleInput">
        <WorkOutlineOutlinedIcon/>
        <input type="text" placeholder='Developer Role' />
        <ArrowDropDownOutlinedIcon/>
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
        <button>Save</button>
    </div>
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
