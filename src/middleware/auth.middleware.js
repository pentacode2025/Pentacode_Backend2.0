import { verifyToken } from '../utils/jwt.js';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization format' });

  const token = parts[1];
  try {
  const payload = verifyToken(token);
  // payload should include electorDni, electorDv and electorFecha (these are added at verification)
  req.user = payload;
    next();
  } catch (err) {
    // differentiate expired token vs invalid token so frontend can redirect appropriately
    if (err && err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired' });
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export default authMiddleware;
