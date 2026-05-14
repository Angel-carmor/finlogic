const app = require('./index');
const pool = require('./config/db');
const port = process.env.PORT || 3000;

const startServer = async () => {
  let connected = false;
  let retries = 5;
  
  console.log('Intentando conectar a la base de datos...');
  
  while (!connected && retries > 0) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Conexión a la base de datos establecida correctamente.');
      connected = true;
    } catch (err) {
      console.error(`❌ Error conectando a la DB (${err.message}). Reintentos restantes: ${retries - 1}`);
      retries--;
      if (retries === 0) {
        console.error('No se pudo conectar a la base de datos. Saliendo...');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  app.listen(port, () => {
    console.log(`🚀 API Server running on port ${port}`);
  });
};

startServer();
