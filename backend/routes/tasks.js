const express = require('express');
const { readJSON, saveJSON } = require('../utils/fileUtils');

const TASKS_FILE = './data/tasks.json';
const router = express.Router();

router.get('/tasks/:projectId', (req, res) => {
  const tasks = readJSON(TASKS_FILE).filter(t => t.projectId === req.params.projectId);
  res.json(tasks);
});

router.post('/tasks', (req, res) => {
  const { title, deadline, status, priority, comment, assignee, author, projectId } = req.body;
  if (!title || !author || !projectId) return res.status(400).json({ error: "title, author та projectId обов'язкові" });

  const tasks = readJSON(TASKS_FILE);
  const newTask = {
    id: Date.now().toString(),
    title,
    deadline: deadline || '',
    status: status || 'Не почато',
    priority: priority || 'Середній',
    assignee: assignee || '',
    author,
    projectId,
  };

  tasks.push(newTask);
  saveJSON(TASKS_FILE, tasks);
  res.status(201).json(newTask);
});

router.put('/tasks/:id', (req, res) => {
  const tasks = readJSON(TASKS_FILE);
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Завдання не знайдено' });

  tasks[index] = { ...tasks[index], ...req.body };
  saveJSON(TASKS_FILE, tasks);
  res.json(tasks[index]);
});

router.delete('/tasks/:id', (req, res) => {
  const tasks = readJSON(TASKS_FILE);
  const updated = tasks.filter(t => t.id !== req.params.id);
  if (tasks.length === updated.length) return res.status(404).json({ error: 'Завдання не знайдено' });

  saveJSON(TASKS_FILE, updated);
  res.json({ message: 'Завдання видалено' });
});

module.exports = router;
