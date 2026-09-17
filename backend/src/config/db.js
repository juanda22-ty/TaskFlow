import mongoose from 'mongoose';

const connectDB = async (reintentos = 10) => {
  for (let i = 1; i <= reintentos; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ MongoDB conectado exitosamente');
      return;
    } catch (error) {
      console.error(`❌ Intento ${i}/${reintentos} fallido conectando a MongoDB: ${error.message}`);
      if (i < reintentos) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  console.error('❌ No se pudo conectar a MongoDB. Saliendo...');
  process.exit(1);
};

export default connectDB;
