const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_finlogic_key_123';

const authMiddleware = (req, res, next) => {
  // 1. Obtener el header Authorization
  const authHeader = req.headers.authorization;

  // 2. Comprobar si existe y tiene el formato "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token o el formato es incorrecto.' });
  }

  // 3. Extraer el token
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verificar el token con nuestra clave secreta
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 5. Si es válido, guardamos los datos del usuario en la request (req.user)
    // para que los siguientes controladores puedan saber quién hace la petición.
    req.user = decoded;
    
    // 6. Pasar al siguiente middleware o controlador (abrir la cerradura)
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;
