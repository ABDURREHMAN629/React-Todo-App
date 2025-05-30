import React from "react";
import { FaTasks } from "react-icons/fa";

export default function Header({ onAddClick }) {
  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-4 rounded-b-2xl">
      <div className="flex items-center space-x-3">
        <FaTasks className="text-indigo-600 text-2xl" />
        <h1 className="text-2xl font-bold text-indigo-700">My Todo</h1>
      </div>
      <button
        onClick={onAddClick}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        + Add Task
      </button>
    </header>
  );
}
