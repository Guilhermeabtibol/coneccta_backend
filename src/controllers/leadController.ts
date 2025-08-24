import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLead = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, source, userId } = req.body;
        const newLead = await prisma.lead.create({
            data: { name, email, phone, source, userId},
            include: { user: true }
        });
        res.status(201).json(newLead);
    } catch (error) {
        res.status(500).json({ error: "Could not create lead" });
    }
};

export const getLeads = async (req: Request, res: Response) => {
    try {
      const leads = await prisma.lead.findMany({
        include: { user: true }
      });
      res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ erro: "Could not fetch leads"});
    }
};

export const getLeadById = async (req: Request, res: Response) => {
    try { 
        const { id } = req.params;
        const lead = await prisma.lead.findUnique({
            where: { id: parseInt(id) },
            include: { user: true},
        });
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch lead" });
    }
};

export const updateLeadStatus = async (req: Request, res: Response) => { 
    try{
        const { id } = req.params;
        const { status } = req.body;
        const updatedLead = await prisma.lead.update({
            where: { id: parseInt(id) },
            data: { status },
            include: { user: true}
        });
        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(500).json({ error: "Could not update lead status"});
    }
};

export const convertLeadToClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lead = await prisma.lead.findUnique({
            where: { id: parseInt(id) },
        });
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        // converte lead para um client
        const cliente = await prisma.client.create({
            data: {
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                leadId: lead.id,
            },
        });

        res.status(201).json(client);
    } catch ( error ) {
        res.status(500).json({ error: "Could not convert lead to client" });
    }
};