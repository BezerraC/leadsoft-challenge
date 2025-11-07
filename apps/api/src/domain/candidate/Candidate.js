const crypto = require('crypto');
const { cpf } = require('cpf-cnpj-validator');

class Candidate {
  constructor(props = {}) {
    const { id, name, cpf, email, birthDate, photoFileName, legend } = props;
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.cpf = cpf ? cpf.replace(/\D/g, '') : '';
    this.email = email ? email.toLowerCase() : '';
    this.birthDate = new Date(birthDate);
    this.photoFileName = photoFileName;
    this.legend = legend;
    this.createdAt = new Date();
  }

  validate() {
    if (!this.name || this.name.length < 3) throw new Error("DomainError: Nome inválido ou muito curto.");
    if (!this.cpf || !cpf.isValid(this.cpf)) {
      throw new Error("DomainError: CPF inválido.");
    }
    if (!this.email || !this.email.includes('@')) throw new Error("DomainError: Email inválido.");
    if (!this.birthDate || isNaN(this.birthDate.getTime())) throw new Error("DomainError: Data de nascimento inválida.");
    if (!this.photoFileName) throw new Error("DomainError: Nome do arquivo da foto é obrigatório.");
    if (!this.legend || this.legend.length < 5) throw new Error("DomainError: Legenda inválida ou muito curta.");
  }
}

module.exports = Candidate;