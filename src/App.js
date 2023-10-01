import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Header from './components/Header';
import List from './components/List';
import AddForm from './components/AddForm';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useSelector } from 'react-redux';
import { selectPicker } from './features/dateSlice';
import RoleOptions from './components/RoleOptions';
import { useEffect } from 'react';

function App() {
  const picker = useSelector(selectPicker);

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

      request.onupgradeneeded = async() => {
        const db = request.result;
        if(!db.objectStoreNames.contains('employeeData')){
          await db.createObjectStore('employeeData', {
            keyPath:"id"
          })
        }
      }

      request.onsuccess = () => {
        console.log("Indexed DB created successfully")
      }
    }
  }

  createEmployeeDB()
  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <>
    <Router>
    <div className="app">
      <Switch>
        <Route exact path="/">
        <Header title="Employee List"/>
        <List/>
        </Route>
        <Route exact path="/addEmp">
          <Header title="Add Employee"/>
          <AddForm/>
          {/* {picker && <DatePicker/>} */}
          <RoleOptions/>
        </Route>
      </Switch>
    </div>
    </Router>
    </>
    // </LocalizationProvider>
  );
}

export default App;
