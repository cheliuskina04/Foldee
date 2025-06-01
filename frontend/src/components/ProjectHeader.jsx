import React, { useState, useEffect } from 'react';
import TeamEditorModal from './TeamEditorModal';
import './componentsStyle/ProjectHeader.css';
import { useNavigate } from 'react-router-dom';

function ProjectHeader({ project, currentUser, showDropdown, setShowDropdown, onDeleteProject,  onTeamUpdated}) {
  const [currentProject, setProject] = useState(project);
  const [showCopied, setShowCopied] = useState(false);
  const [showTeamEditor, setShowTeamEditor] = useState(false);
  const inviteLink = `${window.location.origin}/join-project/${project.id}`;
  const navigate = useNavigate();



  const isCreator = currentProject.creator === currentUser.email;
  const isAdmin = currentProject.admins.includes(currentUser.email);
  const isMember = currentProject.members.includes(currentUser.email);

  const canCopyLink = isAdmin || isCreator;
  const canEditTeam = isCreator;
  const canDeleteProject = isCreator;
  const canLeave = !isCreator && isMember;

  const showMenu = canCopyLink || canEditTeam || canDeleteProject || canLeave;


  // Update currentProject when project prop changes
  useEffect(() => {
    setProject(project);
  }, [project]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleToggleAdmin = async (email) => {
    const isCurrentlyAdmin = currentProject.admins.includes(email);
    const updatedAdmins = isCurrentlyAdmin
      ? currentProject.admins.filter(a => a !== email)
      : [...currentProject.admins, email];

    try {
      const res = await fetch(`http://localhost:3001/api/projects/${currentProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admins: updatedAdmins }),
      });

      if (!res.ok) throw new Error('Не вдалося оновити список адмінів');

      const updatedProject = await res.json();
      setProject(updatedProject);
      onTeamUpdated(); 
    } catch (err) {
      alert(err.message);
    }
  };

  const onLeaveProject = async () => {
    if (!window.confirm('Ви точно хочете покинути цей проєкт?')) return;
  
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${currentProject.id}/remove-member`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email }),
      });
  
      if (!res.ok) throw new Error('Не вдалося покинути проєкт');
  
      // Якщо потрібно, можеш очистити стан або перенаправити користувача
      alert('Ви вийшли з проєкту');
      navigate('/'); // якщо ти використовуєш React Router
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveMember = async (email) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цього користувача?')) return;
  
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${currentProject.id}/remove-member`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (!res.ok) throw new Error('Не вдалося видалити учасника');
  
      const updatedProject = await res.json();
      setProject(updatedProject);
      onTeamUpdated(); 
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={`project-header`}
      style={{
        '--project-color': project.color
      }}>
      <div className="project-header-top">
        <h2 className='project-name'>{currentProject.name}</h2>
        {(isAdmin || currentProject.creator === currentUser.email || true) && (
  <div className="project-menu-wrapper">
  <button
    className="project-menu-button"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    ⋮
  </button>

  {showDropdown && (
    <div
      className="project-dropdown"
      onMouseLeave={() => setShowDropdown(false)}
    >
      {canCopyLink && (
        <button
          className="copy-invite-link"
          onClick={handleCopyLink}
          title="Копіювати посилання для запрошення"
        >
          {showCopied ? 'Скопійовано!' : 'Копіювати посилання'}
        </button>
      )}
      {canEditTeam && (
        <button onClick={() => setShowTeamEditor(true)}>
          Редагувати команду
        </button>
      )}
      {canDeleteProject ? (
        <button onClick={onDeleteProject}>Видалити проєкт</button>
      ) : (
        canLeave && <button onClick={onLeaveProject}>Вийти з проєкту</button>
      )}
    </div>
  )}
</div>
)}
      </div>
      <p>{currentProject.description}</p>

      {showTeamEditor && (
        <TeamEditorModal
          team={currentProject.members.filter(member => member !== currentProject.creator)}
          admins={currentProject.admins}
          onClose={() => setShowTeamEditor(false)}
          onToggleAdmin={handleToggleAdmin}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </div>
  );
}

export default ProjectHeader;
