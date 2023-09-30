import React from 'react';
import "./DatePicker.css"
import { DateCalendar } from '@mui/x-date-pickers';

const DatePicker = () => {
  return (
    <div className='datePicker__mobile'>
        <div className="datePicker__btnRows">
            <button>Today</button>
            <button>Next Monday</button>
        </div>
        <div className="datePicker__btnRows">
            <button>Next Tuesday</button>
            <button>After 1 week</button>
        </div>
        <DateCalendar/>
    </div>
  )
}

export default DatePicker
