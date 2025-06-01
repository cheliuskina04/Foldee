
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Немає токена' });

  const token = authHeader.split(' ')[1];
  try {
    const userData = jwt.verify(token, SECRET);
    req.user = userData;
    next();
  } catch {
    res.status(401).json({ error: 'Токен невалідний або протермінований' });
  }
}

module.exports = { authenticate };
