// src/routes/leadRoutes.ts
import { Router } from 'express';
import { createLead, getLeads, getLeadById, updateLeadStatus, convertLeadToClient } from '../controllers/leadController';
import { protect, authorize } from '../middleware/auth'; // Importe o middleware

const router = Router();

// Aplique o middleware `protect` em cada rota
router.post('/', protect, createLead);
router.get('/', protect, getLeads);
router.get('/:id', protect, getLeadById);
router.put('/:id/status', protect, updateLeadStatus);
router.post('/:id/convert', protect, convertLeadToClient);


// Exemplo de rota que só o admin pode acessar (você pode criar esta rota depois)
router.delete('/:id', protect, authorize('admin'), (req, res) => {
  // Lógica para deletar o lead
  res.status(200).json({ message: "Lead deletado com sucesso" });
});

export default router;