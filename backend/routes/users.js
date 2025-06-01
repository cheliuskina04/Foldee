const express = require('express');
const { readJSON, saveJSON } = require('../utils/fileUtils');
const { authenticate } = require('../utils/authMiddleware');

const USERS_FILE = './data/users.json';
const PROJECTS_FILE = './data/projects.json';

const router = express.Router();

router.get('/user', authenticate, (req, res) => {
  const userData = req.user;
  const projects = readJSON(PROJECTS_FILE);
  const userProjects = projects.filter(p =>
    p.creator === userData.email ||
    (p.admins || []).includes(userData.email) ||
    (p.members || []).includes(userData.email)
  );

  res.json({
    id: userData.id,
    username: userData.username,
    email: userData.email,
    projects: userProjects,
  });
});

router.get('/users/:email', (req, res) => {
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === req.params.email);
  if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
  res.json(user);
});

router.put('/users/:email', (req, res) => {
  const users = readJSON(USERS_FILE);
  const index = users.findIndex(u => u.email === req.params.email);
  if (index === -1) return res.status(404).json({ error: 'Користувача не знайдено' });

  users[index] = { ...users[index], ...req.body };
  saveJSON(USERS_FILE, users);
  res.json(users[index]);
});

module.exports = router;
