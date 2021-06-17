import React, { useEffect, useRef } from "react";

export const CreateTask = ({ tasks, handleSubmit, handleChange, title }) => {
  const inputRef = useRef();
  useEffect(() => inputRef.current.focus(), [tasks.length]); // Устанавливаем focus на поле ввода, после добавления/удаления task

  return (
    <form
      className="create-task"
      onSubmit={handleSubmit} // Вызываем создание нового task с task.title равным значению input
    >
      <input
        className="create-task__task-title"
        type="text"
        ref={inputRef}
        onChange={handleChange} // Устанавливаем значение ввода в title
        value={title} // Подхватываем title; так это поле можно, например, очищать после создания нового task
      />
      <button className="create-task__create-button" type="submit">
        Create
      </button>
    </form>
  );
};
