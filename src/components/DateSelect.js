import React, { useState } from 'react';
import "./DateSelect.css"
import { DateCalendar } from '@mui/x-date-pickers';

const DateSelect = () => {
    const [date, setDate] = useState(null);
  return (
    <div className='dateSelect__mobile'>
        <div className="dateSelect__btnRows">
            <button>Today</button>
            <button>Next Monday</button>
        </div>
        <div className="dateSelect__btnRows">
            <button>Next Tuesday</button>
            <button>After 1 week</button>
        </div>
        <DateCalendar value={date} />
    </div>
  )
}

export default DateSelect
