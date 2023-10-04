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
            let reference = new Date()
            let cList = response.filter((item) => {
                if(item.toDate){
                    let checkDate = new Date(item.toDate);
                    return checkDate.getTime() > reference.getTime() 
                }
                return true 
            })
            setCurrentList(cList)
            let pList = response.filter((item) => {
                return new Date(item.toDate) < reference 
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
    <>
        {empData?.length>0?
            <div className={`listDesk`}>
        <div className='listDesk__desktop'>
        {currentList.length > 0 && <div className="listDesk__currentContainer">
            <h3>Current Employees</h3>
            <ul>
                {currentList?.map(({id, name, role, fromDate}) => {
                    return (
                        <li><ListItem idb={idb} desktop={true} listType="Current" name={name} role={role} key={id} id={id} fromDate={new Date(fromDate)}/></li>
                    )
                })}
            </ul>
        </div>}
        {previousList.length > 0 && <div className="listDesk__previousContainer">
        <h3>Previous Employees</h3>
            <ul>
            {previousList?.map(({id, name, role, fromDate, toDate}) => {
                    return (
                        <li><ListItem idb={idb} desktop={true} listType="Current" name={name} role={role} key={id} id={id} fromDate = {new Date(fromDate)} toDate = {new Date(toDate)}/></li>
                    )
                })}
            </ul>
        </div>}
        </div> 
        </div>: 
        <>
        <div className="listDesk__emptyContainer">
            <img src={logo} alt="" />
        </div>
        </>}
      
    
    </>
  )
}

export default ListDesk
