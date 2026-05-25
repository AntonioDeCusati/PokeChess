import type { Request, Response, NextFunction } from 'express';
import * as service from './chest.service';

export async function inventory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId as string;
    const data = await service.getInventory(userId);
    res.json(data);
  } catch (err) { next(err); }
}

export async function open(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId as string;
    const tier = req.params.tier as any;
    const result = await service.openChest(userId, tier);
    res.json(result);
  } catch (err) { next(err); }
}

export async function buyAndOpen(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId as string;
    const tier = req.params.tier as any;
    const result = await service.buyAndOpenChest(userId, tier);
    res.json(result);
  } catch (err) { next(err); }
}

export async function grant(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId as string;
    const { tier, quantity } = req.body;
    const result = await service.grantChests(userId, tier, quantity);
    res.json(result);
  } catch (err) { next(err); }
}
