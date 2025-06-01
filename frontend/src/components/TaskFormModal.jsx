import React from 'react';
import "./componentsStyle/TaskFormModal.css"
function TaskFormModal({ task, onChange, onSubmit, onCancel, projectMembers }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>{task.id ? 'Редагувати задачу' : 'Нова задача'}</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Назва:</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Дедлайн:</label>
            <input
              type="date"
              name="deadline"
              value={task.deadline}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>Статус:</label>
            <select name="status" value={task.status} onChange={onChange}>
              <option>Не почато</option>
              <option>В процесі</option>
              <option>Завершено</option>
            </select>
          </div>

          <div className="form-group">
            <label>Пріоритет:</label>
            <select name="priority" value={task.priority} onChange={onChange}>
              <option>Високий</option>
              <option>Середній</option>
              <option>Низький</option>
            </select>
          </div>

          <div className="form-group">
            <label>Виконавець:</label>
            <select name="assignee" value={task.assignee} onChange={onChange}>
              <option value="">Виберіть виконавця</option>
              {projectMembers?.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onCancel}>Скасувати</button>
            <button type="submit">{task.id ? 'Зберегти' : 'Створити'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;
