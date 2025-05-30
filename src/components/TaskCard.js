// src/components/TaskCard.js

import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function TaskCard({ title, description, dueDate }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-indigo-700">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <div className="flex items-center text-sm text-gray-500 mt-4">
        <FaRegCalendarAlt className="mr-1 text-indigo-500" />
        {dueDate}
      </div>
    </div>
  );
}
