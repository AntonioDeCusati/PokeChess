import { z } from 'zod';

export const OpenChestParams = z.object({
  tier: z.enum(['wood', 'iron', 'gold', 'diamond']),
});

export const GrantChestsBody = z.object({
  tier: z.enum(['wood', 'iron', 'gold', 'diamond']),
  quantity: z.number().int().min(1).max(999),
});
