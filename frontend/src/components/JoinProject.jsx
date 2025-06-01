import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JoinProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get project from server
        const resProject = await fetch(`http://localhost:3001/api/projects/${projectId}`);
        if (!resProject.ok) throw new Error('Project not found');
        const projectData = await resProject.json();
        setProject(projectData);

        // Get current user from localStorage
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
          setCurrentUser(null);
          setIsMember(false);
          setLoading(false);
          return;
        }
        setCurrentUser(loggedInUser);

        // Check if user is in project members list
        const memberCheck = projectData.members.includes(loggedInUser.email);
        setIsMember(memberCheck);
      } catch (err) {
        setError(err.message || 'Error loading project');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  const handleJoin = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');
    try {
      // Update project members
      const updatedMembers = [...project.members, currentUser.email];
      const resProject = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: updatedMembers }),
      });
      if (!resProject.ok) throw new Error('Failed to join project');
      const updatedProject = await resProject.json();
      setProject(updatedProject);

      // Update user's projects list
      const updatedUserProjects = [...(currentUser.projects || []), projectId];
      const resUser = await fetch(`http://localhost:3001/api/users/${currentUser.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: updatedUserProjects }),
      });
      if (!resUser.ok) throw new Error('Failed to update user');
      const updatedUser = await resUser.json();

      // Update localStorage and state
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setIsMember(true);

      alert(`Successfully joined project "${project.name}"!`);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>You've been invited to join project: {project?.name}</h2>
      <p>{project?.description}</p>

      {currentUser ? (
        isMember ? (
          <div>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              You are already a member of this project! Check your sidebar, it's there!
            </p>
            <button onClick={() => navigate('/home')}>Go to Home</button>
          </div>
        ) : (
          <button onClick={handleJoin}>Join</button>
        )
      ) : (
        <>
          <p style={{ color: 'crimson' }}>
            Oops! Looks like you're not registered in Foldee.
          </p>
          <button onClick={handleRegisterRedirect}>Register</button>
          <p style={{ fontStyle: 'italic', marginTop: '0.5em' }}>
            Register and visit the invitation link again.
          </p>
        </>
      )}
    </div>
  );
}

export default JoinProject;
