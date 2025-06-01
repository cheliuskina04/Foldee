import React, { useState } from 'react';
import './componentsStyle/NewProjectForm.css';

function NewProjectForm({ newProject, setNewProject, onSubmit, onCancel }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [previewUrl, setPreviewUrl] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Новий проект</h2>
        <form onSubmit={(e) => {
  e.preventDefault();
  onSubmit();
}}>
          <div>
            <label>Назва проекту:</label>
            <input
              type="text"
              name="name"
              value={newProject.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Опис:</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Колір:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="color"
                name="color"
                value={newProject.color}
                onChange={handleChange}
              />
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: newProject.color,
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

       

          <div className="modal-buttons">
            <button type="submit">Створити</button>
            <button type="button" onClick={onCancel}>
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProjectForm;
