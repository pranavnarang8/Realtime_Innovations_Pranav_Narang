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
import DatePicker from './components/DatePicker';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <DatePicker/>
        </Route>
      </Switch>
    </div>
    </Router>
    </>
    </LocalizationProvider>
  );
}

export default App;
