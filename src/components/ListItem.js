import React from 'react';
import "./ListItem.css"
import { useDispatch } from 'react-redux';
import { setEmployee } from '../features/employeeSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ListItem = ({id, name, role, fromDate, toDate}) => {
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
    history.push("/addEmp")
  }
  return (
    <>
    <div className='listItem__mobile' onClick={editEmployee}>
      <p>{name}</p>
      <span>{role}</span>
      <span>From {fromDate?.toDateString().substring(4,15)}{toDate && <span>{" "}to {toDate?.toDateString().substring(4,15)}</span>}</span>
    </div>
    </>
  )
}

export default ListItem
