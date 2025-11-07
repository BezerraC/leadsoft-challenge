const Candidate = require('../../domain/candidate/Candidate');

class RegisterCandidate {
  constructor(candidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  async execute(inputData, photoFile) {
    // Criação da entidade de domínio
    const candidate = new Candidate({
      name: inputData.name,
      email: inputData.email,
      cpf: inputData.cpf,
      birthDate: inputData.birthDate,
      legend: inputData.legend,
      photoFileName: photoFile.originalname
    });

    // Validação de Domínio
    candidate.validate();

    // Persistência
    await this.candidateRepository.save(candidate, photoFile.buffer, photoFile.mimetype);

    return candidate;
  }
}

module.exports = RegisterCandidate;