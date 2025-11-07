const RavenCandidateRepository = require("../../repositories/RavenCandidateRepository");
const RegisterCandidate = require("../../../application/use-cases/RegisterCandidate");

class CandidateController {
  constructor() {
    this.repository = new RavenCandidateRepository();
    this.registerUseCase = new RegisterCandidate(this.repository);
  }

  async register(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Foto é obrigatória." });
      }

      // Chama o Caso de Uso passando o body e o file
      const candidate = await this.registerUseCase.execute(req.body, req.file);

      return res.status(201).json({
        message: "Candidato registrado com sucesso!",
        id: candidate.id,
      });
    } catch (error) {
      if (error.message.includes("inválido")) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  async getPhoto(req, res, next) {
    try {
      const { id } = req.params;
      const attachment = await this.repository.getPhotoAttachment(id);

      if (!attachment || !attachment.details || !attachment.data) {
        return res.status(404).send('Foto não encontrada (stream ou detalhes ausentes)');
      }
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Content-Type', attachment.details.contentType);
      
      if (attachment.details.size) {
        res.setHeader('Content-Length', attachment.details.size);
      }

      // Conecta o stream do RavenDB
      attachment.data.pipe(res);

      // Adiciona um listener de erro no stream de origem
      attachment.data.on('error', (err) => {
        console.error("Erro durante o stream da foto:", err);
        res.destroy(err);
      });

    } catch (error) {
      // Este catch lida com erros antas do pipe começar 
      console.error('Erro ao buscar foto:', error);
      if (error.name === 'DocumentDoesNotExistException') {
         return res.status(404).send('Candidato não encontrado');
      }
      next(error);
    }
  }

  async listAll(req, res, next) {
    try {
      const candidates = await this.repository.findAll();
      
      // Mapeia para não devolver dados sensíveis na listagem pública
      const publicData = candidates.map(c => ({
        id: c.id ? c.id.split('/')[1] : null,
        name: c.name,
        legend: c.legend,
      }));

      return res.json(publicData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CandidateController;
