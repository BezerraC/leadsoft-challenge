const Candidate = require('../../domain/candidate/Candidate');

class RegisterCandidate {
  constructor(candidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  async execute(inputData, photoFile) {
    // Limpa os dados de entrada para a consulta
    const cleanCpf = inputData.cpf ? inputData.cpf.replace(/\D/g, '') : '';
    const cleanEmail = inputData.email ? inputData.email.toLowerCase() : '';

    // Verifica se o Email já existe
    const emailExists = await this.candidateRepository.findByEmail(cleanEmail);
    if (emailExists) {
      throw new Error("ConflictError: Email já cadastrado.");
    }

    // Verifica se o CPF já existe
    const cpfExists = await this.candidateRepository.findByCpf(cleanCpf);
    if (cpfExists) {
      throw new Error("ConflictError: CPF já cadastrado.");
    }
    
    // Criação da entidade de domínio
    const candidate = new Candidate({
      name: inputData.name,
      email: cleanEmail,
      cpf: cleanCpf,
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