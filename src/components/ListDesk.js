import React, { useEffect, useState } from 'react';
import "./ListDesk.css"
import ListItem from './ListItem';
import logo from "../Frame_19726.png";
import { useDispatch, useSelector } from 'react-redux';
import { selectList, setList } from '../features/employeeSlice';
import { selectOptions } from '../features/roleSlice';

const ListDesk = ({idb}) => {
    const[currentList, setCurrentList] = useState(null);
    const[previousList, setPreviousList] = useState(null);
    const [empData, setEmpData] = useState([]);
    const dispatch = useDispatch();
    const list = useSelector(selectList)
    const option = useSelector(selectOptions)
    const fetchEmployees = () =>{
        const dbPromise = idb.open("employee-db",1)
    
        dbPromise.onsuccess = () => {
          const db = dbPromise.result;
          const tx = db.transaction("employeeData","readonly");
          const employeeData = tx.objectStore("employeeData");
          const employees = employeeData.getAll();
          let response;
          employees.onsuccess = (query) => {
            setEmpData(query.srcElement.result);
            response = query.srcElement.result;
            // dispatch(setList(data));
            let cList = response.filter((item) => {
                return !item.toDate  
            })
            setCurrentList(cList)
            let pList = response.filter((item) => {
                return item.toDate
            })
            setPreviousList(pList)
          }
    
          employees.onerror = (error) => {
            alert("Error with the fetch request", error)
          }
    
          tx.oncomplete = () => {
            db.close();
          }
          dispatch(setList(response))
      }
    }


    
    useEffect(() => {
        fetchEmployees();
    },[list])

  return (
    <div className={`listDesk ${option && "listDesk__opacity"}`}>
        {empData?.length>0?
        <div className='listDesk__desktop'>
        <div className="listDesk__currentContainer">
            <h3>Current List</h3>
            <ul>
                {currentList?.map(({id, name, role, fromDate}) => {
                    return (
                        <li><ListItem idb={idb} desktop={true} listType="Current" name={name} role={role} key={id} id={id} fromDate={new Date(fromDate)}/></li>
                    )
                })}
            </ul>
        </div>
        <div className="listDesk__previousContainer">
        <h3>Previous List</h3>
            <ul>
            {previousList?.map(({id, name, role, fromDate, toDate}) => {
                    return (
                        <li><ListItem idb={idb} desktop={true} listType="Current" name={name} role={role} key={id} id={id} fromDate = {new Date(fromDate)} toDate = {new Date(toDate)}/></li>
                    )
                })}
            </ul>
        </div>
        {/* <button onClick={addEmployee}><AddOutlinedIcon/></button> */}
        </div> : 
        <>
        <div className="listDesk__emptyContainer">
            <img src={logo} alt="" />
            {/* <button onClick={addEmployee}><AddOutlinedIcon/></button> */}
        </div>
        </>}
      
    </div>
  )
}

export default ListDesk
