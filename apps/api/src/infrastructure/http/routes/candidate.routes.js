const { Router } = require('express');
const CandidateController = require('../controllers/CandidateController');
const express = require('express');
const upload = require('../middlewares/upload');
// const verifyRecaptcha = require('../middlewares/recaptcha');

const router = Router();
const candidateController = new CandidateController();

// POST /api/candidates
router.post(
  '/',
  // verifyRecaptcha,
  upload.single('photo'),
  (req, res, next) => candidateController.register(req, res, next)
);

// GET /api/candidates
router.get('/', (req, res, next) => candidateController.listAll(req, res, next));

// Rota para buscar a foto de um candidato específico
router.get('/:id/photo', (req, res, next) => candidateController.getPhoto(req, res, next));

router.post(
  '/:id/comments',
  express.json(), 
  (req, res, next) => candidateController.addComment(req, res, next)
);

module.exports = router;