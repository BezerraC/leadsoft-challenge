
const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado pelo middleware:', err);
  
  // Erros comuns
  if (err.name === 'ValidationError') {
     return res.status(400).json({ error: 'Dados inválidos', details: err.message });
  }

  if (err.message.includes('Candidate already registered')) {
      return res.status(409).json({ error: 'Candidato já registrado.' });
  }

  // Fallback para erro
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({
    error: 'Erro interno do servidor.',
    ...(isDev && { stack: err.stack })
  });
};

module.exports = { errorHandler };