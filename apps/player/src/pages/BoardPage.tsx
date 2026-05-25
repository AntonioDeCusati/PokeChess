import { useCallback, useMemo, useState } from 'react';
import {
  BoardTabs,
  CollezioneSection,
  ConfigurazioneSection,
  PrimaLineaSection,
} from '@/components/board';
import { CreaturePickerModal } from '@/components/board/CreaturePickerModal';
import { MovePickerModal } from '@/components/board/MovePickerModal';
import { useBootstrap } from '@/hooks/useBootstrap';
import { api } from '@/lib/api';
import { movesById } from '@/data';
import type { BoardTab, UserCreature, TeamSlot, Move, MovePattern } from '@/types';

interface TeamSlotDto {
  index: number;
  creatureId: string;
  creatureSlug: string;
  moveId: string;
}

export function BoardPage() {
  const [tab, setTab] = useState<BoardTab>('board');
  const { creatures = [], team: serverTeam, loading } = useBootstrap();

  const [localTeam, setLocalTeam] = useState<{ slots: TeamSlotDto[] } | null>(null);
  const team = localTeam ?? serverTeam;

  // Sync server data into local state when it arrives
  if (serverTeam && !localTeam) {
    setLocalTeam(serverTeam);
  }

  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [movePickerSlot, setMovePickerSlot] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const teamSlots: TeamSlot[] | null = team
    ? team.slots.map((s) => ({
        index: s.index as TeamSlot['index'],
        creatureId: s.creatureId as TeamSlot['creatureId'],
        moveId: s.moveId as TeamSlot['moveId'],
      }))
    : null;

  const usedCreatureIds = new Set(teamSlots?.map((s) => s.creatureId) ?? []);

  const usedMovePatterns = useMemo(() => {
    const map = new Map<MovePattern, number>();
    if (!teamSlots) return map;
    for (const slot of teamSlots) {
      const move = movesById[slot.moveId];
      if (move) {
        map.set(move.pattern, (map.get(move.pattern) ?? 0) + 1);
      }
    }
    return map;
  }, [teamSlots]);

  const handleChangeSlot = useCallback((slotIndex: number) => {
    setPickerSlot(slotIndex);
  }, []);

  const handlePickCreature = useCallback(async (creature: UserCreature) => {
    if (pickerSlot == null || !team) return;

    const currentSlot = team.slots.find((s) => s.index === pickerSlot);
    const moveId = currentSlot?.moveId ?? 'horizontal';

    // Optimistic update
    const newSlot: TeamSlotDto = {
      index: pickerSlot,
      creatureId: creature.id,
      creatureSlug: creature.slug,
      moveId,
    };
    setLocalTeam((prev) => {
      if (!prev) return { slots: [newSlot] };
      const existing = prev.slots.filter((s) => s.index !== pickerSlot);
      return { slots: [...existing, newSlot].sort((a, b) => a.index - b.index) };
    });
    setPickerSlot(null);

    // Persist in background
    setSaving(true);
    try {
      const result = await api.post<{ team: { slots: TeamSlotDto[] } }>('/team/update', {
        slots: [{ index: pickerSlot, creatureSlug: creature.slug, moveId }],
      });
      setLocalTeam(result.team);
    } catch (err) {
      console.error('Failed to update team slot:', err);
    } finally {
      setSaving(false);
    }
  }, [pickerSlot, team]);

  const handleChangeMove = useCallback((slotIndex: number) => {
    setMovePickerSlot(slotIndex);
  }, []);

  const handlePickMove = useCallback(async (move: Move) => {
    if (movePickerSlot == null || !team) return;

    const slotDto = team.slots.find((s) => s.index === movePickerSlot);
    if (!slotDto) return;

    // Optimistic update
    setLocalTeam((prev) => {
      if (!prev) return prev;
      return {
        slots: prev.slots.map((s) =>
          s.index === movePickerSlot ? { ...s, moveId: move.id } : s,
        ),
      };
    });
    setMovePickerSlot(null);

    // Persist in background
    setSaving(true);
    try {
      const result = await api.post<{ team: { slots: TeamSlotDto[] } }>('/team/update', {
        slots: [{ index: movePickerSlot, creatureSlug: slotDto.creatureSlug, moveId: move.id }],
      });
      setLocalTeam(result.team);
    } catch (err) {
      console.error('Failed to update move:', err);
    } finally {
      setSaving(false);
    }
  }, [movePickerSlot, team]);

  if (loading && !localTeam) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-text-secondary text-sm">Caricamento...</span>
      </div>
    );
  }

  const movePickerCurrentSlot = movePickerSlot != null
    ? teamSlots?.find((s) => s.index === movePickerSlot)
    : null;

  return (
    <div className="flex flex-col">
      <BoardTabs value={tab} onChange={setTab} />

      <div className="flex flex-col gap-3 px-3 py-3">
        {tab === 'board' ? (
          <>
            <PrimaLineaSection
              creatures={creatures}
              teamSlots={teamSlots}
              onChangeSlot={handleChangeSlot}
              onChangeMove={handleChangeMove}
            />
            <ConfigurazioneSection />
            <CollezioneSection creatures={creatures} />
          </>
        ) : (
          <CollezioneSection creatures={creatures} columns={4} />
        )}
      </div>

      {pickerSlot != null && (
        <CreaturePickerModal
          creatures={creatures}
          usedCreatureIds={usedCreatureIds}
          onPick={handlePickCreature}
          onClose={() => setPickerSlot(null)}
        />
      )}

      {movePickerSlot != null && movePickerCurrentSlot && (
        <MovePickerModal
          currentMoveId={movePickerCurrentSlot.moveId}
          usedMovePatterns={usedMovePatterns}
          onPick={handlePickMove}
          onClose={() => setMovePickerSlot(null)}
        />
      )}

      {saving && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-bg-elevated px-3 py-1 text-[10px] text-text-secondary shadow-lg border border-border-subtle">
          Salvataggio...
        </div>
      )}
    </div>
  );
}
