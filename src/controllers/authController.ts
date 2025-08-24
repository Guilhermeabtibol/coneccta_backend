// src/controllers/authController.ts
import type { Request, Response } from 'express';
import type { PrismaClient } from '@prisma/client';
import type bcrypt from 'bcryptjs';
import type jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_muito_seguro_e_secreto';

// Validação de senha: mínimo de 6 caracteres, uma letra maiúscula e um caractere especial
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

// Rota de registro com validação de senha
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // 1. Valida a senha usando a expressão regular
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: "A senha deve ter no mínimo 6 caracteres, uma letra maiúscula e um caractere especial." 
      });
    }

    // 2. Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Cria o novo usuário
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
      // Adiciona um tratamento de erro para e-mail duplicado
      if (error.code === 'P2002') {
          return res.status(409).json({ error: 'Este e-mail já está em uso.' });
      }
    res.status(500).json({ error: "Não foi possível registrar o usuário." });
  }
};

// Rota de login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Encontra o usuário pelo e-mail
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    
    // Compara a senha fornecida com a senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    
    // Gera o JWT com o id e a função (role) do usuário
    const token = jwt.sign({ userId: user.id, userRole: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao tentar fazer login." });
  }
};