const express = require('express');
const { readJSON, saveJSON } = require('../utils/fileUtils');

const PROJECTS_FILE = './data/projects.json';
const TASKS_FILE = './data/tasks.json';

const router = express.Router();

router.get('/projects', (req, res) => {
  res.json(readJSON(PROJECTS_FILE));
});

router.get('/projects/:id', (req, res) => {
  const project = readJSON(PROJECTS_FILE).find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Проєкт не знайдено' });
  res.json(project);
});

router.post('/projects', (req, res) => {
  const { name, description, color, creator, admins, members } = req.body;
  if (!name || !creator) return res.status(400).json({ error: "Name та Creator обов'язкові" });

  const projects = readJSON(PROJECTS_FILE);
  const newProject = {
    id: Date.now().toString(),
    name,
    description: description || '',
    color: color || '#81c8ff',
    creator,
    admins: admins || [creator],
    members: members || [creator],
  };

  projects.push(newProject);
  saveJSON(PROJECTS_FILE, projects);
  res.status(201).json(newProject);
});

router.put('/projects/:id', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Проєкт не знайдено' });

  projects[index] = { ...projects[index], ...req.body };
  saveJSON(PROJECTS_FILE, projects);
  res.json(projects[index]);
});

router.delete('/projects/:id', (req, res) => {
    const projectId = req.params.id;
  
    // Читаємо проєкти
    let projects = readJSON(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id.toString() === projectId);
  
    if (index === -1) {
      return res.status(404).json({ error: 'Проєкт не знайдено' });
    }
  
    // Видаляємо проєкт
    projects.splice(index, 1);
    saveJSON(PROJECTS_FILE, projects);
  
    // Читаємо таски
    let tasks = readJSON(TASKS_FILE);
  
    // Фільтруємо таски, лишаємо тільки ті, що не належать цьому проєкту
    const filteredTasks = tasks.filter(task => task.projectId.toString() !== projectId);
  
    // Записуємо оновлений список тасок
    saveJSON(TASKS_FILE, filteredTasks);
  
    res.json({ message: 'Проєкт та всі його таски видалено' });
  });
  

router.put('/projects/:projectId/join', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const index = projects.findIndex(p => p.id === req.params.projectId);
  if (index === -1) return res.status(404).json({ error: 'Проєкт не знайдено' });

  const email = req.body.email;
  if (!projects[index].members.includes(email)) {
    projects[index].members.push(email);
    saveJSON(PROJECTS_FILE, projects);
  }

  res.json(projects[index]);
});

router.put('/projects/:id/toggle-admin', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Проєкт не знайдено' });

  const email = req.body.email;
  if (!project.members.includes(email)) {
    return res.status(400).json({ error: 'Користувач не є учасником проєкту' });
  }

  project.admins = project.admins.includes(email)
    ? project.admins.filter(a => a !== email)
    : [...project.admins, email];

  saveJSON(PROJECTS_FILE, projects);
  res.json(project);
});

router.put('/projects/:id/remove-member', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const tasks = readJSON(TASKS_FILE);
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Проєкт не знайдено' });

  const project = projects[index];
  const email = req.body.email;

  project.members = project.members.filter(m => m !== email);
  project.admins = project.admins.filter(a => a !== email);

  const updatedTasks = tasks.map(t =>
    t.projectId === project.id && t.assignee === email
      ? { ...t, assignee: '' }
      : t
  );

  saveJSON(TASKS_FILE, updatedTasks);
  saveJSON(PROJECTS_FILE, projects);
  res.json(project);
});

module.exports = router;
