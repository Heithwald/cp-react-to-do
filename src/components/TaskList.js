import React from "react";
import { Task } from "./Task";

export const TaskList = ({
  tasks,
  filterType,
  updateTaskStatus,
  updateTask,
  deleteTask,
}) => {
  // Если фильтр не был нажат и filterType равен null, маппим оригинальный массив tasks
  if (!filterType) {
    return (
      <div className="task-list">
        {tasks.map((task, index) => (
          <Task
            key={index}
            index={index}
            task={task}
            updateTaskStatus={updateTaskStatus}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    );
  } else {
    // Если фильтр был нажат и установлен filterType, фильтруем оригинальный массив tasks по filterType и маппим уже отфильтрованный массив filteredTasks
    let filteredTasks = tasks.filter((task) => task.status === filterType);
    return (
      <div className="task-list">
        {filteredTasks.map((task) => (
          <Task
            key={task.originalIndex}
            index={task.originalIndex} // передаём originalIndex, чтобы значения массивов tasks и filteredTasks матчились 1-к-1
            task={task}
            updateTaskStatus={updateTaskStatus}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    );
  }
};
