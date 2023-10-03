import React, { useState } from 'react';
import "./ListItem.css"
import { useDispatch } from 'react-redux';
import { setEmployee } from '../features/employeeSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListItem = ({id, name, role, fromDate, toDate, desktop, idb}) => {
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
    if(!desktop){
      history.push("/addEmp")
    }
    
  }

  const handleSwipe = () =>{
    setIsSwiped(true);
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
}
  return (
    <>
    {!desktop ? <div className={`listItem ${isSwiped && "listItem__swiped"}`}  onTouchStart={handleSwipe}>
      <div className="listItem__mobile" onClick={editEmployee}>
      <p>{name}</p>
      <span>{role}</span>
      <span>From {fromDate?.toDateString().substring(4,15)}{toDate && <span>{" "}to {toDate?.toDateString().substring(4,15)}</span>}</span>
      </div>
      {isSwiped && <div className='listItem__swipeDelete'><DeleteIcon onClick={deleteEmployee}/></div>}
    </div> : 
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
