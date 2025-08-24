// src/routes/clientRoutes.ts
import { Router } from 'express';
import { getClients, getClientById } from '../controllers/clientController';
import { protect, authorize } from '../middleware/auth'; // Importe o middleware

const router = Router();

// Apenas usuários com role de 'admin' ou 'sales' podem ver os clientes
router.get('/', protect, authorize('admin', 'sales'), getClients);
router.get('/:id', protect, authorize('admin', 'sales'), getClientById);

export default router;