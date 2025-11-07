const { Router } = require('express');
const candidateRoutes = require('./candidate.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

// Rotas de candidatos
router.use('/candidates', candidateRoutes);

// Rotas de admin
router.use('/admin', adminRoutes);

module.exports = router;