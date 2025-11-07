
const app = require('./app');
const { getStore } = require('./infrastructure/database/ravenStore');

const PORT = process.env.PORT || 3001;

// Inicializa a store do RavenDB antes de aceitar requisições
try {
  const store = getStore();
  console.log(`Conexão com RavenDB [${store.database}] inicializada.`);
} catch (error) {
  console.error('Falha ao conectar no RavenDB:', error);
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Servidor LeadSoft API rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

async function gracefulShutdown(signal) {
  console.log(`\n${signal} recebido. Fechando servidor...`);
  
  server.close(async () => {
    console.log('Servidor HTTP fechado.');
    
    try {
      const store = getStore();
      if (store) {
        store.dispose(); // Fecha conexões ativas do RavenDB
        console.log('Conexões RavenDB fechadas.');
      }
      process.exit(0);
    } catch (err) {
      console.error('Erro ao fechar conexões do banco:', err);
      process.exit(1);
    }
  });

  // Se o graceful shutdown travar, força o encerramento após 10s
  setTimeout(() => {
    console.error('Encerramento forçado por timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Captura de erros não tratados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});