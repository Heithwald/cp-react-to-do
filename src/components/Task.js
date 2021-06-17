import React from "react";

export const Task = ({
  index,
  task,
  updateTask,
  updateTaskStatus,
  deleteTask,
}) => {
  const statusTypes = ["New", "Active", "WIP", "Done"]; // Массив вариантов task.status

  return (
    <div className="task-list__task">
      <input
        className="task-title"
        type="text"
        value={task.title}
        onChange={(event) => updateTask(index, event.target.value)} // Обновляем значение task.title при вводе
      />
      <select
        className="task-status"
        value={task.status}
        onChange={(event) => updateTaskStatus(index, event.target.value)} // Обновляем значение task.status при вводе
      >
        {statusTypes.map((type, index) => (
          <option key={index}>{type}</option>
        ))}
      </select>
      <button
        className="task-delete-button"
        onClick={() => deleteTask(index)} // Удаляем task по пропу index
      >
        Delete
      </button>
    </div>
  );
};
