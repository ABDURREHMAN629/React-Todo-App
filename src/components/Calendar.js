// src/components/Calendar.js
import React, { useState, useEffect } from "react";

const Calendar = ({ onDateSelect }) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const getDays = () => {
      const date = new Date(year, month + 1, 0);
      const days = [];
      for (let i = 1; i <= date.getDate(); i++) {
        days.push(i);
      }
      setDaysInMonth(days);
    };
    getDays();
  }, [month, year]);

  const handleDateClick = (day) => {
    const selected = new Date(year, month, day);
    onDateSelect(selected.toISOString().split("T")[0]); // 'YYYY-MM-DD'
  };

  const handleMonthChange = (step) => {
    let newMonth = month + step;
    let newYear = year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      {/* Year Dropdown */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Select Year:</span>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={2020 + i}>
              {2020 + i}
            </option>
          ))}
        </select>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => handleMonthChange(-1)}>&lt;</button>
        <span className="font-semibold">
          {new Date(year, month).toLocaleString("default", { month: "long" })}
        </span>
        <button onClick={() => handleMonthChange(1)}>&gt;</button>
      </div>

      {/* Dates */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {daysInMonth.map((day) => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            className="px-3 py-1 border rounded hover:bg-indigo-100"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
