// src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_muito_seguro_e_secreto';

// Rota de registro (agora com hash de senha)
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Não foi possível registrar o usuário." });
  }
};

// Nova rota de login (gerando JWT)
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Encontra o usuário pelo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    
    // Compara a senha fornecida com a senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    
    // Gera o JWT com o id e a role do usuário
    const token = jwt.sign({ userId: user.id, userRole: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao tentar fazer login." });
  }
};