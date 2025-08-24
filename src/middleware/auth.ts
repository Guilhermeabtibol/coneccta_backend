// src/middleware/auth.ts
import type { Request, Response, NextFunction } from 'express';
import type jwt from 'jsonwebtoken';

interface UserPayload {
    userId: number;
    userRole: string;
    iat: number;
    exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'KD4Jr7P9UJnrRb0qhuQfzXNOnxCWEDkz';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Token não fornecido ou inválido." });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    
    // Adiciona o usuário à requisição para ser usado nas rotas
    (req as any).user = payload;
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

// middleware para veirifcar a role do usuario
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).user.userRole;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ error: "Acesso negado." });
        }
        next();
    };
};