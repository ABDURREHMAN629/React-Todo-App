// src/components/AddTaskModal.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AddTaskModal({ onClose, onTaskCreate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dueDateTime = new Date(`${dueDate}T${dueTime}`);

      const newTask = {
        title,
        desc,
        dueDateTime: dueDateTime.toISOString(),
        fileName: file ? file.name : null,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "tasks"), newTask);
      console.log("✅ Task saved:", docRef.id);

      alert("✅ Task saved successfully!");

      if (onTaskCreate) {
        onTaskCreate(newTask);
      }

      onClose(); // Close modal
    } catch (error) {
      console.error("❌ Error saving task:", error);
      alert("❌ Failed to save task.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">
          Add New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded-md"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <input
            type="time"
            className="w-full p-2 border rounded-md"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            required
          />
          <input
            type="file"
            className="w-full"
            accept="image/*,audio/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
