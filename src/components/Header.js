import React, { useState } from 'react';
import "./Header.css"
import { useDispatch, useSelector } from 'react-redux';
import { removeRole, selectOptions } from '../features/roleSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { resetDeleteDialog, setDeleteDialog, unsetEmployee } from '../features/employeeSlice';

const Header = ({title, employee, idb}) => {
  const option = useSelector(selectOptions);
  const history = useHistory();
  const dispatch = useDispatch();

  const deleteEmployee = () =>{
    const dbPromise = idb.open("employee-db",1)
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("employeeData","readwrite");
      const employeeData = tx.objectStore("employeeData");
      const deletedEmp = employeeData.delete(employee?.id)

      deletedEmp.onsuccess = () => {
        tx.oncomplete = () => {
          db.close()
        }
      }

      deletedEmp.onerror = (error) =>{
        alert("Error with Indexed DB here",error)
      }
  }
  dispatch(unsetEmployee())
  dispatch(removeRole())
  dispatch(setDeleteDialog());
  setTimeout(() => {
    dispatch(resetDeleteDialog())
  },2000)
  history.push("/")
}
    
  return (
    <>
    <div className={`header__mobile`}>
      <h2>{title}</h2>
      {employee && <DeleteIcon onClick={deleteEmployee}/>}
    </div>
    </>
  )
}

export default Header
