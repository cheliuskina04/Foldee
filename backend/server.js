
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/projects'));
app.use('/api', require('./routes/tasks'));

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
