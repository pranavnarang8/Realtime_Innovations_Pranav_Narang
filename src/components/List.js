import React, { useEffect, useState } from 'react';
import "./List.css"
import ListItem from './ListItem';
import logo from "../Frame_19726.png";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { selectList, setList } from '../features/employeeSlice';

const List = ({idb}) => {
    const[currentList, setCurrentList] = useState(null);
    const[previousList, setPreviousList] = useState(null);
    const [empData, setEmpData] = useState([])
    const history = useHistory();
    const dispatch = useDispatch();
    const list = useSelector(selectList)

    const fetchEmployees = () =>{
        const dbPromise = idb.open("employee-db",1)
    
        dbPromise.onsuccess = () => {
          const db = dbPromise.result;
          const tx = db.transaction("employeeData","readonly");
          const employeeData = tx.objectStore("employeeData");
          const employees = employeeData.getAll();
          let data;
          employees.onsuccess = (query) => {
            setEmpData(query.srcElement.result);
            data = query.srcElement.result;
            let reference = new Date()
            let cList = data.filter((item) => {
                if(item.toDate){
                    let checkDate = new Date(item.toDate);
                    return checkDate.getTime() > reference.getTime() 
                }
                return true
            })
            setCurrentList(cList)
            let pList = data.filter((item) => {
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
          dispatch(setList(data))
      }
    }
    const addEmployee = () => {
        history.push("/addEmp")
    }

    
    useEffect(() => {
        fetchEmployees();
        console.log("Checking")
    },[list])


  return (
    <>
    <div className="list__mobileView">
        {empData?.length>0?
        <div className='list__mobile'>
        {currentList.length > 0 && <div className="list__currentContainer">
            <h3>Current Employees</h3>
            <ul>
                {currentList?.map(({id, name, role, fromDate}) => {
                    return (
                        <li><ListItem idb={idb} listType="Current" name={name} role={role} key={id} id={id} fromDate={new Date(fromDate)}/></li>
                    )
                })}
            </ul>
        </div>}
        {previousList.length > 0 && <div className="list__previousContainer">
        <h3>Previous Employees</h3>
            <ul>
            {previousList?.map(({id, name, role, fromDate, toDate}) => {
                    return (
                        <li><ListItem idb={idb} listType="Current" name={name} role={role} key={id} id={id} fromDate = {new Date(fromDate)} toDate = {new Date(toDate)}/></li>
                    )
                })}
            </ul>
        </div>}
        <button onClick={addEmployee}><AddOutlinedIcon/></button>
        </div> : 
        <>
        <div className="list__emptyContainer">
            <img src={logo} alt="" />
            <button onClick={addEmployee}><AddOutlinedIcon/></button>
        </div>
        </>}
        
    </div>
      
    </>
  )
}

export default List
