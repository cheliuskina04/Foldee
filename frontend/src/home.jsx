import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import ProjectDetails from './components/ProjectDetails';
import WeatherWidget from './components/WeatherWidget';
import Logo from '/icon.svg';
import './Styles/home.css';
import NewProjectForm from './components/NewProjectForm';

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#000000'
  });
  const [userProjects, setUserProjects] = useState({
    creator: [],
    admin: [],
    member: []
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const handleNewProject = () => {
    setShowNewProjectForm(true);
  };

  const handleProjectSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      if (!user?.email) {
        console.error('Нема email користувача');
        return;
      }
  
      const projectData = {
        ...newProject,
        creator: user.email
      };
  
      const res = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Помилка при створенні проєкту');
      }
  
      const createdProject = await res.json();
  
      setUserProjects(prev => ({
        ...prev,
        creator: [...prev.creator, createdProject]
      }));
  
      setShowNewProjectForm(false);
      setNewProject({ name: '', description: '', color: '#000000' });
    } catch (err) {
      console.error('Помилка створення проєкту:', err);
      alert(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Не вдалося отримати дані користувача');

        const userData = await res.json();
        setUser(userData);
        setUserProjects({
          creator: userData.projects.filter(p => p.creator === userData.email),
          admin: userData.projects.filter(p =>
            p.admins.includes(userData.email) && p.creator !== userData.email
          ),
          member: userData.projects.filter(p =>
            p.members.includes(userData.email) &&
            !p.admins.includes(userData.email) &&
            p.creator !== userData.email
          ),
        });
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);
  const [showWidget, setShowWidget] = useState(false);

  const toggleWidget = () => {
    setShowWidget(prev => !prev);
  };

  const isAdmin = activeProject?.admins?.includes(user?.email) || false;

  const renderProjectList = (projects, title) => {
    if (projects.length === 0) return null;

    return (
      <div className="project-category">
        <h3>{title}</h3>
        <ul className="project-list">
          {projects.map(project => (
            <li
              key={project.id}
              className="project-item"
              style={{ borderLeft: `4px solid ${project.color}` }}
              onClick={() => setActiveProject(project)}
            >
              {isSidebarOpen && (
                <div className="project-item-content">
                  <span className="project-name">{project.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (!user) return <div>Завантаження...</div>;

  return (
    <div className={`home-page ${showNewProjectForm ? 'blurred-background' : ''}`}>
      <aside className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <div className="sidebar-logo" onClick={() => setActiveProject(null)}>
          <img src={Logo} alt="Logo" />
        </div>

        <button
          className="sidebar-new-project"
          onClick={handleNewProject}
          style={{ display: isSidebarOpen ? 'block' : 'none' }}
        >
          Новий проект
        </button>

        <div className="projects-list">
          {renderProjectList(userProjects.creator, 'Мої проекти')}
          {renderProjectList(userProjects.admin, 'Проекти, де я адмін')}
          {renderProjectList(userProjects.member, 'Проекти, де я учасник')}
        </div>

        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? '◀' : '▶'}
        </button>

        <button className="sidebar-logout" onClick={handleLogout}>
          Вихід
        </button>
      </aside>

      <main className="main-content">
      {activeProject ? (
        <div className="project-page">
          <ProjectDetails project={activeProject} isAdmin={isAdmin} />
        </div>
      ) : (
        <>
          <button 
        className="top-right-button"
        onClick={toggleWidget}></button>
          {/* Центроване привітання та відео */}
          <div className="welcome-video-container">
  <h2 className="welcome-message">
    Привіт, {user.username || user.email}! Обери проект зліва.
  </h2>

  <video 
    className="ted-video" 
    src="./How to manage your time more effectively (according to machines) - Brian Christian.mp4" 
    controls 
  />

    <a className="video-caption" href="https://www.youtube.com/watch?v=iDbdXTMnOmE" >
    How to manage your time more effectively (according to machines) - Brian Christian
    </a>
</div>

      {/* Піксельний кіт */}
      <div className="pixel-cat"></div>

          {showWidget && (
        <div className="widget">
          <WeatherWidget user={user} />
        </div>
      )}
        </>
      )}
    </main>

      {showNewProjectForm && (
        <NewProjectForm
          newProject={newProject}
          setNewProject={setNewProject}
          onSubmit={handleProjectSubmit}
          onCancel={() => setShowNewProjectForm(false)}
        />
      )}
    </div>
  );
}

export default Home;
