import React, { useState } from 'react';
import "./ListItem.css"
import { useDispatch } from 'react-redux';
import { resetDeleteDialog, setDeleteDialog, setEmployee, setList } from '../features/employeeSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { resetProfile, } from '../features/roleSlice';

const ListItem = ({id, name, role, fromDate, toDate, desktop, idb, cList}) => {
  const [isSwiped, setIsSwiped] = useState(false);
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
    dispatch(resetProfile())
    if(!desktop){
      history.push("/addEmp")
    }
  }

  const handleSwipe = () =>{
    setTimeout(() => {
      if(!isSwiped){
        setIsSwiped(true);
      }else{
        setIsSwiped(false)
      }
    },500)
  }

  
  const deleteEmployee = () =>{
    const dbPromise = idb.open("employee-db",1)
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("employeeData","readwrite");
      const employeeData = tx.objectStore("employeeData");
      const deletedEmp = employeeData.delete(id)

      deletedEmp.onsuccess = () => {
        tx.oncomplete = () => {
          db.close()
        }
      }

      deletedEmp.onerror = (error) =>{
        alert("Error with Indexed DB here",error)
      }
  }

  dispatch(setList(true));
  dispatch(setDeleteDialog());
  setTimeout(() => {
    dispatch(resetDeleteDialog())
  },2000)
  if(!desktop){
    setIsSwiped(false)
    history.push("/")
  }
}
  return (
    <>
    {!desktop ? <li className={`listItem ${isSwiped && "listItem__swiped"}`}  onTouchStart={handleSwipe} >
      <div className="listItem__mobile" onClick={editEmployee}>
      <p>{name}</p>
      <span>{role}</span>
      <span>From {fromDate?.toDateString().substring(4,15)}{toDate && !cList && <span>{" "}to {toDate?.toDateString().substring(4,15)}</span>}</span>
      </div>
      {isSwiped && <div className='listItem__swipeDelete'><DeleteOutlineIcon onClick={deleteEmployee}/></div>}
    </li> : 
    <div className='listItem__desktop'>
      <p>{name}</p>
      <span>{role}</span>
      <span>From {fromDate?.toDateString().substring(4,15)}{toDate && <span>{" "}to {toDate?.toDateString().substring(4,15)}</span>}</span>
      <div className="listItem__actions">
        <EditIcon onClick={editEmployee}/>
        <DeleteIcon onClick={deleteEmployee}/>
      </div>
    </div>}
    </>
  )
}

export default ListItem
