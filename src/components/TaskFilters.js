import React from "react";

export const TaskFilters = ({ filterTasks, resetFilters }) => {
  const statusTypes = ["Active", "New", "WIP", "Done"]; // Массив вариантов task.status

  return (
    <fieldset className="filters">
      <legend>Filters</legend>
      {statusTypes.map((type, index) => (
        <button
          key={index}
          className="filters__filter-button"
          onClick={() => {
            filterTasks(type); // Передаём type в filterType, что триггерит фильтрацию массива tasks по task.type === type
          }}
        >
          {type}
        </button>
      ))}
      <button
        className="filters__filter-button"
        onClick={resetFilters} // Сбрасываем filterType на null
      >
        Reset
      </button>
    </fieldset>
  );
};
