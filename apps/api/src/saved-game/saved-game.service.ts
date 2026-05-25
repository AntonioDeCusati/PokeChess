import { prisma } from '../db';
import { HttpError } from '../http/errors';

export interface SavedGameDto {
  id: string;
  name: string | null;
  state: unknown;
  createdAt: string;
  updatedAt: string;
}

function toDto(row: { id: string; name: string | null; state: unknown; createdAt: Date; updatedAt: Date }): SavedGameDto {
  return {
    id: row.id,
    name: row.name,
    state: row.state,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listSaves(userId: string): Promise<SavedGameDto[]> {
  const rows = await prisma.savedGame.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map(toDto);
}

export async function getSave(userId: string, id: string): Promise<SavedGameDto> {
  const row = await prisma.savedGame.findFirst({ where: { id, userId } });
  if (!row) throw HttpError.notFound('Saved game not found');
  return toDto(row);
}

export async function createSave(userId: string, name: string | null, state: unknown): Promise<SavedGameDto> {
  const row = await prisma.savedGame.create({
    data: { userId, name, state: state as any },
  });
  return toDto(row);
}

export async function updateSave(userId: string, id: string, name: string | null, state: unknown): Promise<SavedGameDto> {
  const existing = await prisma.savedGame.findFirst({ where: { id, userId } });
  if (!existing) throw HttpError.notFound('Saved game not found');
  const row = await prisma.savedGame.update({
    where: { id },
    data: { name, state: state as any },
  });
  return toDto(row);
}

export async function deleteSave(userId: string, id: string): Promise<void> {
  const existing = await prisma.savedGame.findFirst({ where: { id, userId } });
  if (!existing) throw HttpError.notFound('Saved game not found');
  await prisma.savedGame.delete({ where: { id } });
}
