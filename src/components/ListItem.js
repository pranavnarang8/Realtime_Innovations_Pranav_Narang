import React from 'react';
import "./ListItem.css"
import { useDispatch } from 'react-redux';
import { setEmployee } from '../features/employeeSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ListItem = ({id, name, role}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const editEmployee = () => {
    dispatch(setEmployee({
      id: id,
    }))
    history.push("/addEmp")
  }
  return (
    <>
    <div className='listItem__mobile' onClick={editEmployee}>
      <p>{name}</p>
      <span>{role}</span>
      <span>From 22nd Jul,2023</span>
    </div>
    </>
  )
}

export default ListItem
