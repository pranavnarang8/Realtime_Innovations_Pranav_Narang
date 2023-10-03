import React, { useEffect, useState } from 'react';
import "./List.css"
import ListItem from './ListItem';
import logo from "../Frame_19726.png";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const List = ({idb}) => {
    const[currentList, setCurrentList] = useState(null);
    const[previousList, setPreviousList] = useState(null);
    const [empData, setEmpData] = useState([])
    const history = useHistory();

    const fetchEmployees = () =>{
        const dbPromise = idb.open("employee-db",1)
    
        dbPromise.onsuccess = () => {
          const db = dbPromise.result;
          const tx = db.transaction("employeeData","readonly");
          const employeeData = tx.objectStore("employeeData");
          const employees = employeeData.getAll();
          employees.onsuccess = (query) => {
            setEmpData(query.srcElement.result);
            let data = query.srcElement.result
            let cList = data.filter((item) => {
                return !item.toDate  
            })
            setCurrentList(cList)
            let pList = data.filter((item) => {
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
      }
    }
    const addEmployee = () => {
        history.push("/addEmp")
    }

    
    useEffect(() => {
        fetchEmployees();
    },[])


  return (
    <>
    <div className="list__mobileView">
        {empData?.length>0?
        <div className='list__mobile'>
        <div className="list__currentContainer">
            <h3>Current List</h3>
            <ul>
                {currentList?.map(({id, name, role, fromDate}) => {
                    return (
                        <li><ListItem idb={idb} listType="Current" name={name} role={role} key={id} id={id} fromDate={new Date(fromDate)}/></li>
                    )
                })}
            </ul>
        </div>
        <div className="list__previousContainer">
        <h3>Previous List</h3>
            <ul>
            {previousList?.map(({id, name, role, fromDate, toDate}) => {
                    return (
                        <li><ListItem idb={idb} listType="Current" name={name} role={role} key={id} id={id} fromDate = {new Date(fromDate)} toDate = {new Date(toDate)}/></li>
                    )
                })}
            </ul>
        </div>
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
