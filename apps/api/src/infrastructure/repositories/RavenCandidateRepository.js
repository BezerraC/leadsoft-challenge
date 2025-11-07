const { getStore } = require("../database/ravenStore");
const { GetAttachmentOperation, PutAttachmentOperation } = require('ravendb');
const Candidate = require('../../domain/candidate/Candidate');

class RavenCandidateRepository {
  async save(candidateEntity, photoBuffer, photoContentType) {

    const store = getStore();
    const documentId = 'candidates/' + candidateEntity.id;

    const session = store.openSession();
    try {
      await session.store(candidateEntity, documentId);
      await session.saveChanges();
      console.log(`Documento ${documentId} salvo. Agora salvando anexo...`);
    } catch (error) {
      console.error("Erro ao salvar o documento (Etapa 1):", error);
      throw error;
    } finally {
      session.dispose();
    }

    try {
      const putOperation = new PutAttachmentOperation(
        documentId,
        candidateEntity.photoFileName,
        photoBuffer,
        photoContentType
      );

      await store.operations.send(putOperation);

      console.log(`Anexo salvo com sucesso para ${documentId}.`);

    } catch (error) {
      console.error("Erro ao salvar o anexo via Operação (Etapa 2):", error);
      throw error;
    }
  }

  async getPhotoAttachment(candidateId) {
    const store = getStore();
    const documentId = candidateId.includes('candidates/') ? candidateId : 'candidates/' + candidateId;

    const session = store.openSession();
    let photoFileName;
    try {
      const candidate = await session.load(documentId, Candidate);
      if (!candidate || !candidate.photoFileName) {
        return null;
      }
      photoFileName = candidate.photoFileName;
    } finally {
      session.dispose();
    }

    const operation = new GetAttachmentOperation(documentId, photoFileName, "Document", null);
    
    const attachment = await store.operations.send(operation);
    return attachment;
  }


  async findAll() {
    const session = getStore().openSession();
    try {
      const candidates = await session.query({ 
          collection: 'Candidates',
          documentType: Candidate 
      })
      .orderByDescending('createdAt')
      .all();
      
      return candidates;
    } finally {
      session.dispose();
    }
  }

  async findByEmail(email) {
    const session = getStore().openSession();
    try {
      return await session.query({ collection: 'Candidates' })
        .whereEquals('email', email)
        .firstOrNull();
    } finally {
      session.dispose();
    }
  }

  async findByCpf(cpf) {
     const session = getStore().openSession();
    try {
      return await session.query({ collection: 'Candidates' })
        .whereEquals('cpf', cpf)
        .firstOrNull();
    } finally {
      session.dispose();
    }
  }

  // Buscar um documento
  async findById(candidateId) {
    const store = getStore();
    const session = store.openSession();
    try {
      const documentId = 'candidates/' + candidateId;
      return await session.load(documentId, Candidate);
    } finally {
      session.dispose();
    }
  }

  // Salvar o documento atualizado
  async update(candidateEntity) {
    const store = getStore();
    const session = store.openSession();
    try {
      await session.store(candidateEntity);
      await session.saveChanges();
    } finally {
      session.dispose();
    }
  }

  async deleteById(candidateId) {
    const store = getStore();
    const session = store.openSession();
    const documentId = 'candidates/' + candidateId;

    try {
      // Carrega o documento para saber o nome do anexo
      const candidate = await session.load(documentId, Candidate);
      if (!candidate) {
        return;
      }

      // Marcar o anexo para exclusão, se ele existir
      if (candidate.photoFileName) {
        session.advanced.attachments.delete(documentId, candidate.photoFileName);
      }

      // Marcar o documento principal para exclusão
      session.delete(documentId);

      // Executar ambas as exclusões em uma única transação
      await session.saveChanges();
      console.log(`Documento e anexo de ${documentId} deletados.`);

    } catch (error) {
      console.error("Erro ao deletar candidato por ID:", error);
      throw error;
    } finally {
      session.dispose();
    }
  }
}

module.exports = RavenCandidateRepository;
