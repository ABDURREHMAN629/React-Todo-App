import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { format } from "date-fns";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [showDoneTasks, setShowDoneTasks] = useState(false);
  const [overdueTasks, setOverdueTasks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const sorted = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setTasks(sorted);

      const today = new Date().toDateString();
      setTodayTasks(
        sorted.filter(
          (task) =>
            new Date(task.dueDateTime).toDateString() === today && !task.isDone
        )
      );

      setOverdueTasks(
        sorted.filter(
          (task) =>
            !task.isDone && new Date(task.dueDateTime).toDateString() < today
        )
      );
    });
    return () => unsub();
  }, []);

  const markDone = async (id) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { isDone: true });
  };

  const markLater = async (id) => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    defaultDate.setHours(9, 0, 0, 0);
    const newDueDate = prompt(
      "Enter new due date and time (YYYY-MM-DD HH:MM):",
      `${defaultDate.toISOString().slice(0, 16).replace("T", " ")}`
    );
    if (newDueDate) {
      const [datePart, timePart] = newDueDate.split(" ");
      const selectedDateTime = new Date(
        `${datePart}T${timePart}`
      ).toISOString();
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { dueDateTime: selectedDateTime });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this task?")) {
      await deleteDoc(doc(db, "tasks", id));
    }
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const displayedDates = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(year, month, i + 1)
  );

  const selectedDateTasks = tasks.filter(
    (task) =>
      new Date(task.dueDateTime).toDateString() ===
        new Date(selectedDate).toDateString() && !task.isDone
  );

  const allUndoneTasks = tasks.filter((task) => !task.isDone);
  const allDoneTasks = tasks.filter((task) => task.isDone);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-screen p-4 overflow-hidden">
      {/* Left Panel */}
      <div className="bg-white p-4 rounded-xl shadow-xl h-full flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col">
          <h3 className="text-lg font-bold mb-2">Today's Tasks</h3>
          <div className="flex-1 overflow-y-auto">
            {todayTasks.length ? (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="mb-3 p-3 rounded-md shadow hover:bg-indigo-50 transition border-l-4 border-orange-400"
                >
                  <h4 className="font-semibold">{task.title}</h4>
                  <p>{task.desc}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No tasks for today.</p>
            )}
          </div>

          {overdueTasks.length > 0 && (
            <div className="mt-4 flex-1 min-h-0 flex flex-col">
              <h3 className="text-red-600 font-bold mb-2">Overdue Tasks</h3>
              <div
                className={`flex-1 overflow-y-auto ${
                  overdueTasks.length > 4 ? "pr-2" : ""
                }`}
              >
                {overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    className="mb-3 p-3 rounded-md shadow hover:bg-red-50 transition border-l-4 border-red-400"
                  >
                    <h4 className="font-semibold text-red-700">{task.title}</h4>
                    <p className="text-sm text-red-600">{task.desc}</p>
                    <p className="text-xs text-red-500 mt-1">
                      Was due: {format(new Date(task.dueDateTime), "PPpp")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 rounded bg-indigo-100 text-indigo-700">
          💡 Tip: Stay consistent and beat procrastination!
        </div>
      </div>

      {/* Right Panel */}
      <div className="col-span-2 flex flex-col h-full overflow-hidden">
        {/* Calendar Section - Fixed 40% height */}
        <div
          className="bg-white p-4 rounded-xl shadow-xl mb-4"
          style={{ height: "40%" }}
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="p-1 rounded border"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i}>{2023 + i}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMonth((prev) => (prev > 0 ? prev - 1 : 11))}
                  className="px-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  ◀
                </button>
                <span className="font-semibold">
                  {new Date(year, month).toLocaleString("default", {
                    month: "long",
                  })}
                </span>
                <button
                  onClick={() => setMonth((prev) => (prev < 11 ? prev + 1 : 0))}
                  className="px-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  ▶
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-xs font-semibold">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center flex-1 min-h-0 overflow-y-auto">
              {displayedDates.map((date, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`p-1 rounded hover:bg-indigo-100 transition text-sm ${
                    selectedDate.toDateString() === date.toDateString()
                      ? "bg-indigo-300 text-white"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>

            {selectedDateTasks.length > 0 && (
              <div className="mt-2 flex-1 min-h-0 overflow-y-auto">
                <h4 className="font-bold mb-1 text-sm">
                  Tasks on {format(selectedDate, "PP")}:
                </h4>
                <div className="space-y-2">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-2 bg-white shadow-sm rounded-lg hover:shadow transition border-l-2 border-indigo-300"
                    >
                      <h4 className="font-semibold text-indigo-700 text-sm">
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-600">{task.desc}</p>
                      <div className="flex justify-end gap-1 mt-1">
                        <button
                          onClick={() => markDone(task.id)}
                          className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => markLater(task.id)}
                          className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        >
                          Later
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Tasks Section - Exactly 2 rows (6 tasks) visible */}
        <div className="bg-white p-4 rounded-xl shadow-xl flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">All Tasks</h3>
            <button
              onClick={() => setShowDoneTasks((prev) => !prev)}
              className="text-sm text-indigo-700 underline hover:text-indigo-900"
            >
              {showDoneTasks ? "Hide Completed" : "Show Completed"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 gap-3">
              {[...allUndoneTasks].reverse().map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-white shadow-sm rounded-lg hover:shadow-md hover:bg-indigo-50 transition border-l-2 border-indigo-300"
                >
                  <h4 className="font-semibold text-indigo-700 text-sm line-clamp-1">
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {task.desc}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {format(new Date(task.dueDateTime), "PPpp")}
                  </p>
                  <div className="flex justify-end gap-1 mt-2">
                    <button
                      onClick={() => markDone(task.id)}
                      className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => markLater(task.id)}
                      className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      Later
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {showDoneTasks &&
                allDoneTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition border-l-2 border-blue-400"
                  >
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {task.title}
                    </h4>
                    <p className="text-xs line-clamp-2">{task.desc}</p>
                    <p className="text-xs mt-1">
                      Done on: {format(new Date(task.dueDateTime), "PPpp")}
                    </p>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
