import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Header from './components/Header';
import List from './components/List';
import AddForm from './components/AddForm';
import { useSelector } from 'react-redux';
import { selectPicker } from './features/dateSlice';
import RoleOptions from './components/RoleOptions';
import { useState } from 'react';
import { selectEmployee } from './features/employeeSlice';
import AddEmp from './components/AddEmp';
import ListDesk from './components/ListDesk';
import { selectOptions } from './features/roleSlice';

function App() {
  const picker = useSelector(selectPicker);
  const employee = useSelector(selectEmployee);
  const [mobileView, setMobileView] = useState(true)
  const option = useSelector(selectOptions);

  const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ;

  const createEmployeeDB = () =>{
    if(!idb){
      alert("This browser doesn't support Indexed DB");
      return;
    }else{
      const request = idb.open('employee-db', 1)

      request.onerror = (error) =>{
        alert("Error with Indexed DB ",error)
      }

      request.onupgradeneeded = () => {
        const db = request.result;
        if(!db.objectStoreNames.contains('employeeData')){
          db.createObjectStore('employeeData', {
            keyPath:"id"
          })
        }
      }

      request.onsuccess = () => {
        
      }
    }
  }

  window.addEventListener("resize", function () {
    if(this.window.innerWidth > 540){
      setMobileView(false)
    }else{
      setMobileView(true)
    }
})

  createEmployeeDB();
  return (
    <>
    {mobileView && window.innerWidth < 540?
    <Router>
    <div className="app">
      <Switch>
        <Route exact path="/">
        <Header title="Employee List"/>
        <List idb={idb}/>
        </Route>
        <Route exact path="/addEmp">
          <Header title={employee ? "Edit Employee Details":"Add Employee"}/>
          <AddForm idb={idb}/>
          <RoleOptions desktop={false}/>
        </Route>
      </Switch>
    </div>
    </Router> : 
    <div className="app__desktop">
    <Header title="Employee List"/>
    <AddEmp idb={idb}/>
    <ListDesk idb={idb}/>
    <RoleOptions desktop={true}/>
    </div>
}
    </>
  );
}

export default App;
