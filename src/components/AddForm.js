import React, { useState } from 'react';
import "./AddForm.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';


const AddForm = () => {
    const [name, setName] = useState(null);
    const [role, setRole] = useState(null);
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
            <input type="text" />
            <InsertInvitationOutlinedIcon/>
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
    </>
  )
}

export default AddForm
