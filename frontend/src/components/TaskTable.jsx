import React from 'react';
import "./componentsStyle/TaskTable.css";

function TaskTable({
  tasks,
  filters,
  setFilters,
  currentUser,
  onAssignSelf,
  onStatusChange,
  onEditTask,
  onDeleteTask,  // додано пропс для видалення задачі
  isAdmin,
  projectMembers,
}) {
  const filteredTasks = tasks.filter(task => 
    (!filters.status || task.status === filters.status) &&
    (!filters.priority || task.priority === filters.priority) &&
    (!filters.assignee || task.assignee === filters.assignee)
  );

  return (
    <>
      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">Всі статуси</option>
          <option value="Не почато">Не почато</option>
          <option value="В процесі">В процесі</option>
          <option value="Завершено">Завершено</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
        >
          <option value="">Всі пріоритети</option>
          <option value="Високий">Високий</option>
          <option value="Середній">Середній</option>
          <option value="Низький">Низький</option>
        </select>

        <select
          value={filters.assignee}
          onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
        >
          <option value="">Всі виконавці</option>
          {projectMembers?.map(member => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>
      <div class="tasks-table-wrapper">
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Дедлайн</th>
            <th>Статус</th>
            <th>Пріоритет</th>
            <th>Виконавець</th>
            <th>Автор</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <tr key={task.id}>
                <td className="title">{task.title}</td>
                <td>{task.deadline}</td>
                <td>
                  {task.assignee === currentUser.email ? (
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                    >
                      <option value="Не почато">Не почато</option>
                      <option value="В процесі">В процесі</option>
                      <option value="Завершено">Завершено</option>
                    </select>
                  ) : (
                    task.status
                  )}
                </td>
                <td>{task.priority}</td>
                <td>{task.assignee}</td>
                <td>{task.author}</td>
                <td>
                  {!task.assignee && (
                    <button
                      onClick={() => {
                        if (window.confirm('Ви впевнені, що хочете взяти це завдання?')) {
                          onAssignSelf(task.id);
                        }
                      }}
                      className="assign-self-button"
                      title="Взяти собі цю задачу на виконання"
                    >
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEditTask(task)}
                        className="edit-task-button" title="Редагувати"
                      >
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="remove-task-button" 
                        title="Видалити"
                        style={{ marginLeft: '5px' }}
                      >
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="8" style={{ textAlign: 'center' }}>Немає задач</td></tr>
          )}
        </tbody>
      </table>
      </div>
    </>
  );
}

export default TaskTable;
