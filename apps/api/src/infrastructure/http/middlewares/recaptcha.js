const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
  const token = req.headers['x-recaptcha-token'];
  if (!token) return res.status(400).json({ error: 'Recaptcha token missing' });

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`);
    
    if (!response.data.success) {
       return res.status(403).json({ error: 'Recaptcha verification failed', details: response.data['error-codes'] });
    }
    
    if (response.data.score < 0.5) {
       return res.status(403).json({ error: 'Bot detected (low score)', score: response.data.score });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Recaptcha server error' });
  }
};

module.exports = { verifyRecaptcha };