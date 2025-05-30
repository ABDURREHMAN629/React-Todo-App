// src/App.js
import "./App.css";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AddTaskModal from "./components/AddTaskModal";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const scheduleNotification = (task) => {
    const now = new Date();
    const timeUntil = new Date(task.dueDateTime) - now;

    if (timeUntil <= 0) return;

    setTimeout(() => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("⏰ Task Reminder", {
          body: `It's time for: ${task.title}`,
        });
      } else {
        alert(`Reminder: ${task.title}`);
      }
    }, timeUntil);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 text-gray-800">
      <Header onAddClick={() => setShowModal(true)} />
      <main className="p-4">
        <Dashboard />
      </main>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onTaskCreate={(task) => {
            scheduleNotification(task);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
