const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authorize = (...allowedRoles) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido', error: error.message });
  }
};

module.exports = authorize;
