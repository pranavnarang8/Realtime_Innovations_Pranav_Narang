import React from 'react';
import "./ListItem.css"
import { useDispatch } from 'react-redux';
import { setEmployee } from '../features/employeeSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListItem = ({id, name, role, fromDate, toDate , desktop}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const editEmployee = () => {
    dispatch(setEmployee({
      id: id,
      name: name,
      role: role,
      fromDate: fromDate,
      toDate: toDate,
    }))
    if(!desktop){
      history.push("/addEmp")
    }
    
  }
  return (
    <>
    {!desktop ? <div className='listItem__mobile' onClick={editEmployee}>
      <p>{name}</p>
      <span>{role}</span>
      <span>From {fromDate?.toDateString().substring(4,15)}{toDate && <span>{" "}to {toDate?.toDateString().substring(4,15)}</span>}</span>
    </div> : 
    <div className='listItem__desktop'>
      <p>{name}</p>
      <span>{role}</span>
      <span>From {fromDate?.toDateString().substring(4,15)}{toDate && <span>{" "}to {toDate?.toDateString().substring(4,15)}</span>}</span>
      <div className="listItem__actions">
        <EditIcon onClick={editEmployee}/>
        <DeleteIcon/>
      </div>
    </div>}
    </>
  )
}

export default ListItem
