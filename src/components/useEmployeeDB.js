import { useState } from "react";



export default function useEmployeeDB(initialValue){
    const [empData, setEmpData] = useState(initialValue);
    const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
    const dbPromise = idb.open("employee-db",1);
        dbPromise.onsuccess = () => {
          const db = dbPromise.result;
          const tx = db.transaction("employeeData","readonly");
          const employeeData = tx.objectStore("employeeData");
          const employees = employeeData.getAll();
          employees.onsuccess = (query) => {
            setEmpData(query.srcElement.result);
          }
    
          employees.onerror = (error) => {
            alert("Error with the fetch request", error)
          }
    
          tx.oncomplete = () => {
            db.close();
          }
          return empData;
      }
    }
