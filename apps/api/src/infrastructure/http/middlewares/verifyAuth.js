const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token de autorização ausente.' });
    }

    // O token vem no formato Bearer
    const token = authHeader.split(' ')[1];
    
    // Verifica se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Anexa os dados do usuário na requisição
    req.user = decoded; 
    next();

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = verifyAuth;