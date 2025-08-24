import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import clientRoutes from './routes/clientRoutes';
import leadRoutes from './routes/leadRoutes';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// rotas da api
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/clients', clientRoutes);

app.get('/', (req, res) => {
    res.send('Connecta Backend está rodando!');
});

async function main() {
    try {
        await prisma.$connect();
        console.log("Banco de dados conectado com sucesso!");
        app.listen(PORT, () => {
            console.log(`Servidor está rodando em http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error("Falha na conexão com o banco de dados ou iniciar o servidor: ", e);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();