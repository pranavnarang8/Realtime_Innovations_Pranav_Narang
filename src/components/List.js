import React, { useState } from 'react';
import "./List.css"
import ListItem from './ListItem';
import logo from "../Frame_19726.png";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const List = () => {
    const[currentList, setCurrentList] = useState(null);
    const[previousList, setPreviousList] = useState(null);
    const history = useHistory();

    const addEmployee = () => {
        history.push("/addEmp")
    }
  return (
    <>
    <div className="list__mobileView">
        {currentList || previousList ?
        <div className='list__mobile'>
        <div className="list__currentContainer">
            <h3>Current List</h3>
            <ul>
                <li><ListItem listType="Current"/></li>
            </ul>
        </div>
        <div className="list__previousContainer">
        <h3>Previous List</h3>
            <ul>
                <li><ListItem listType="Previous"/></li>
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
