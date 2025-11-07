const { Router } = require('express');
const express = require('express');
const AdminController = require('../controllers/AdminController');
const verifyAuth = require('../middlewares/verifyAuth');
const { verifyRecaptcha } = require('../middlewares/recaptcha');

const router =Router();
const adminController = new AdminController();

// POST /api/admin/login
router.post(
  '/login',
  express.json(),
  verifyRecaptcha,
  (req, res, next) => adminController.login(req, res, next)
);

// Rota para o dashboard listar todos os dados de candidates
router.get(
  "/candidates",
  verifyAuth,
  (req, res, next) => adminController.listAllSecure(req, res, next)
);

// Rota para deletar um candidato
router.delete(
  '/candidates/:id',
  verifyAuth,
  (req, res, next) => adminController.deleteCandidate(req, res, next)
);

// Rota para deletar um comentário
router.delete(
  '/candidates/:candidateId/comments/:commentId',
  verifyAuth,
  (req, res, next) => adminController.deleteComment(req, res, next)
);

module.exports = router;