// src/index.ts
import express from 'express';
import cors from 'cors'; // Importe o middleware cors
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import clientRoutes from './routes/clientRoutes';
import leadRoutes from './routes/leadRoutes';

// Inicialize o Express
const app = express();
const PORT = process.env.PORT || 3000;

// Inicialize o cliente Prisma
const prisma = new PrismaClient();

// Use o middleware CORS antes de qualquer outra coisa
app.use(cors());

// Middleware para parsear corpos JSON
app.use(express.json());

// Conecte-se ao banco de dados
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Use as rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/leads', leadRoutes);

// Inicie o servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
