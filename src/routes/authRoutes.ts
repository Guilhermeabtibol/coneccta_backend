// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController'; // Adicione loginUser

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // Adicione a nova rota de login

export default router