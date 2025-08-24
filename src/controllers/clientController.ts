import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await prisma.client.findMany();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch clients" });
    }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch client" });
  }
};