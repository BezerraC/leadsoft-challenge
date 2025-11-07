const jwt = require("jsonwebtoken");
const RavenCandidateRepository = require("../../repositories/RavenCandidateRepository");

// Credenciais hardcoded
const ADMIN_EMAIL = "LeadIA@leadsoft.inf.br";
const ADMIN_PASS = "Lead@1234";
const JWT_SECRET = process.env.JWT_SECRET;

class AdminController {
  constructor() {
    this.repository = new RavenCandidateRepository();
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validar credenciais
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        // Gerar o Token JWT
        const token = jwt.sign(
          {
            userId: "admin_leadia",
            role: "admin",
          },
          JWT_SECRET,
          { expiresIn: "8h" }
        );

        return res.status(200).json({
          message: "Login bem-sucedido!",
          token: token,
        });
      } else {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }
    } catch (error) {
      next(error);
    }
  }

  async listAllSecure(req, res, next) {
    try {
      const candidates = await this.repository.findAll();
      const adminData = candidates.map(c => ({
        id: c.id,
        guid: c.id ? c.id.split('/')[1] : null,
        name: c.name,
        legend: c.legend,
        comments: c.comments || [],
        email: c.email,
        cpf: c.cpf,
        birthDate: c.birthDate,
        photoFileName: c.photoFileName,
      }));
      
      res.status(200).json(adminData.filter(c => c.id));
    } catch (error) {
      next(error);
    }
  }

  async deleteCandidate(req, res, next) {
    try {
      const { id } = req.params;
      await this.repository.deleteById(id);
      res.status(200).json({ message: "Candidato deletado com sucesso." });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { candidateId, commentId } = req.params;

      const candidate = await this.repository.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ error: "Candidato não encontrado." });
      }

      const originalCount = candidate.comments ? candidate.comments.length : 0;
      candidate.comments = (candidate.comments || []).filter((c) => c.id !== commentId);

      if (candidate.comments.length === originalCount) {
        return res.status(404).json({ error: "Comentário não encontrado." });
      }

      await this.repository.update(candidate);
      res.status(200).json({ message: "Comentário deletado com sucesso." });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
