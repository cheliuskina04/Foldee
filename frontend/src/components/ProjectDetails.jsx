import React, { useState, useEffect } from 'react';
import ProjectHeader from './ProjectHeader';
import { useNavigate } from 'react-router-dom';
import TaskTable from './TaskTable';
import TaskFormModal from './TaskFormModal';
import "./componentsStyle/ProjectDetails.css";

function ProjectDetails({ project, isAdmin }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: ''
  });
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [shouldReloadTasks, setShouldReloadTasks] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [currentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('loggedInUser'));
  });
  
  useEffect(() => {
    // Початкове завантаження тасків при зміні проекту
    async function fetchTasks() {
      try {
        const res = await fetch(`http://localhost:3001/api/tasks/${project.id}`);
        if (!res.ok) throw new Error('Не вдалося завантажити задачі');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTasks();
  }, [project.id]);
  
  useEffect(() => {
    // Оновлення тасків після зміни команди
    async function fetchTasks() {
      try {
        const res = await fetch(`http://localhost:3001/api/tasks/${project.id}`);
        if (!res.ok) throw new Error('Не вдалося завантажити задачі');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    }
  
    if (shouldReloadTasks) {
      fetchTasks();
      setShouldReloadTasks(false);
    }
  }, [shouldReloadTasks, project.id]);

  // Оновлюємо projectId в newTask при зміні проекту
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    status: 'Не почато',
    priority: 'Середній',
    tags: [],
    assignee: '',
    author: '',
    projectId: project.id
  });

  useEffect(() => {
    setNewTask(prev => ({ ...prev, projectId: project.id }));
  }, [project.id]);

  // Обробка зміни в формі створення задачі
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Додати нову задачу
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return alert('Вкажи назву задачі');

    try {
      const res = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          author: currentUser.email,
          projectId: project.id
        }),
      });
      if (!res.ok) throw new Error('Помилка при створенні задачі');

      const createdTask = await res.json();
      setTasks(prev => [...prev, createdTask]);
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        deadline: '',
        status: 'Не почато',
        priority: 'Середній',
        tags: [],
        assignee: '',
        author: '',
        projectId: project.id
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // Зміна в формі редагування задачі
  const handleEditTaskChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };

  // Зберегти відредаговану задачу
  const handleSaveEditTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask),
      });
      if (!res.ok) throw new Error('Помилка при оновленні задачі');

      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
      setShowEditTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Призначити собі задачу
  const handleAssignSelf = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, assignee: currentUser.email };

      const res = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error('Помилка при оновленні виконавця');

      const data = await res.json();
      setTasks(prev => prev.map(t => (t.id === taskId ? data : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  // Змінити статус задачі
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, status: newStatus };
      const res = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error('Помилка при оновленні статусу');

      const data = await res.json();
      setTasks(prev => prev.map(t => (t.id === taskId ? data : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  // Видалити задачу
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Видалити задачу?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Помилка при видаленні задачі');

      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей проект?')) {
      try {
        const res = await fetch(`http://localhost:3001/api/projects/${project.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Не вдалося видалити проєкт');

        const userRes = await fetch(`http://localhost:3001/api/users/${currentUser.email}`);
        const userData = await userRes.json();

        localStorage.setItem('loggedInUser', JSON.stringify(userData));

        // оновити глобальний стан, якщо потрібно

        navigate('/home');  // React Router перенаправлення
      } catch (err) {
        alert(err.message);
      } finally {
        setShowDropdown(false);
      }
    }
  };
  

  return (
    <div className="project-details">
      <div className="project-header-container">
        <ProjectHeader
          project={project}
          currentUser={currentUser}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          onDeleteProject={handleDeleteProject}
          onTeamUpdated={() => setShouldReloadTasks(true)}  // новий колбек
        />
      </div>

      {isAdmin && (
        <button
          className="new-task-button"
          onClick={() => setShowNewTaskModal(true)}
        >
          Створити задачу
        </button>
      )}

      <div className="tasks-table-wrapper">
        <TaskTable
          tasks={tasks.filter(task => task.projectId === project.id)}
          filters={filters}
          setFilters={setFilters}
          currentUser={currentUser}
          onAssignSelf={handleAssignSelf}
          onStatusChange={handleStatusChange}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowEditTaskModal(true);
          }}
          onDeleteTask={handleDeleteTask}
          isAdmin={isAdmin}
          projectMembers={project.members}
        />
      </div>

      {showNewTaskModal && (
        <TaskFormModal
          task={newTask}
          onChange={handleNewTaskChange}
          onSubmit={handleAddTask}
          onCancel={() => setShowNewTaskModal(false)}
          projectMembers={project.members}
        />
      )}

      {showEditTaskModal && editingTask && (
        <TaskFormModal
          task={editingTask}
          onChange={handleEditTaskChange}
          onSubmit={handleSaveEditTask}
          onCancel={() => {
            setShowEditTaskModal(false);
            setEditingTask(null);
          }}
          projectMembers={project.members}
        />
      )}
    </div>
  );
}

export default ProjectDetails;
