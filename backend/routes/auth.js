
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readJSON, saveJSON } = require('../utils/fileUtils');

const router = express.Router();
const USERS_FILE = './data/users.json';
const SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email і пароль потрібні' });
  }

  const users = readJSON(USERS_FILE);
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Користувач з таким email вже існує' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), username, email, password: hashedPassword };
  users.push(newUser);
  saveJSON(USERS_FILE, users);

  res.status(201).json({ message: 'Реєстрація пройшла успішно' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Користувача не знайдено' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Невірний пароль' });

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;
