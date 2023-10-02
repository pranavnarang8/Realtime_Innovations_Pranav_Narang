import React, { useEffect, useState } from 'react';
import "./AddEmp.css";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';

const AddEmp = () => {
    const [name, setName] = useState("");
    const [tDate, setTDate] = useState(null)
    const [fDate, setFDate] = useState(null)
    const [tPicker, setTPicker] = useState(false)
    const [fPicker, setFPicker] = useState(false)

    const handleOptions = () => {

    }

    const handleCancel = () => {

    }

    const handleAddition = () => {

    }

  return (
    <div className='addEmp'>
      <div className='addEmp__desktop'>
        <div className="addEmp__container">
      <div className="addEmp__nameInput">
        <PersonOutlineOutlinedIcon/>
        <input type="text" placeholder='Employee Name' value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="addEmp__roleInput">
        <WorkOutlineOutlinedIcon/>
        <input type="text" value={name} placeholder='Employee Role' />
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
  )
}

export default AddEmp
