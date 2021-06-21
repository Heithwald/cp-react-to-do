import React, { useState, useEffect } from "react";
import { CreateTask } from "./components/CreateTask";
import { TaskFilters } from "./components/TaskFilters";
import { TaskList } from "./components/TaskList";

const App = () => {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filterType, setFilterType] = useState(null);

  /// Сохранение/получение state в/из localStorage ///
  useEffect(() => {
    setTasks(JSON.parse(window.localStorage.getItem(('tasks'))));
    console.log(NYMPHEA);
  }, [])

  useEffect(() => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks])

  useEffect(() => {
    setFilterType(JSON.parse(window.localStorage.getItem(('filterType'))));
  }, [])

  useEffect(() => {
    window.localStorage.setItem('filterType', JSON.stringify(filterType));
  }, [filterType])

  /// Обработчик клика кнопки. Вызывает функцию cоздания task при наличии значения в строке ///
  const handleSubmit = (event) => {
    event.preventDefault();

    if (title) {
      addTask(title);
      setTitle("");
    }
    return null;
  };

  /// Функция сохранения значения строки ввода, передаёт значение в state ///
  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  /// Функция создания task ///
  const addTask = (title) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      { title, status: "New", originalIndex: currentTasks.length }, // originalIndex требуется для обновления массива при внесении изменений в отфильтрованные task
    ]);
  };

  /// Функция редактирования task ///
  const updateTask = (index, currentValue) => {
    let newTasks = [...tasks];
    newTasks[index].title = currentValue;
    setTasks(newTasks);
  };

  /// Функция редактирования task.status ///
  const updateTaskStatus = (index, currentValue) => {
    let newTasks = [...tasks];
    newTasks[index].status = currentValue;
    setTasks(newTasks);
  };

  /// Функция удаления task ///
  const deleteTask = (index) => {
    if (window.confirm("Do you really want to delete this task?")) {
      let newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    }
  };

  /// Функция фильтрации по статусам ///
  const filterTasks = (statusType) => {
    setFilterType(statusType);
  };

  const resetFilters = () => {
    setFilterType(null);
  };

  return (
    <div className="App">
      <CreateTask
        tasks={tasks}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        title={title}
      />
      <TaskFilters filterTasks={filterTasks} resetFilters={resetFilters} />
      <TaskList
        tasks={tasks}
        filterType={filterType}
        resetFilters={resetFilters}
        updateTask={updateTask}
        updateTaskStatus={updateTaskStatus}
        deleteTask={deleteTask}
      />
    </div>
  );
};

export default App;
