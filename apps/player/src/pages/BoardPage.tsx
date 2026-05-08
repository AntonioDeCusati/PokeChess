import { useCallback, useState } from 'react';
import {
  BoardTabs,
  CollezioneSection,
  ConfigurazioneSection,
  PrimaLineaSection,
} from '@/components/board';
import { CreaturePickerModal } from '@/components/board/CreaturePickerModal';
import { useBootstrap } from '@/hooks/useBootstrap';
import { api } from '@/lib/api';
import { movesById } from '@/data';
import type { BoardTab, UserCreature, TeamSlot } from '@/types';

export function BoardPage() {
  const [tab, setTab] = useState<BoardTab>('board');
  const { creatures, team, loading, refetch } = useBootstrap();

  const [pickerSlot, setPickerSlot] = useState<number | null>(null);

  const teamSlots: TeamSlot[] | null = team
    ? team.slots.map((s) => ({
        index: s.index as TeamSlot['index'],
        creatureId: s.creatureId as TeamSlot['creatureId'],
        moveId: s.moveId as TeamSlot['moveId'],
      }))
    : null;

  const usedCreatureIds = new Set(teamSlots?.map((s) => s.creatureId) ?? []);

  const handleChangeSlot = useCallback((slotIndex: number) => {
    setPickerSlot(slotIndex);
  }, []);

  const handlePickCreature = useCallback(async (creature: UserCreature) => {
    if (pickerSlot == null) return;

    const currentSlot = teamSlots?.find((s) => s.index === pickerSlot);
    const moveId = currentSlot?.moveId ?? 'move-horizontal';

    try {
      await api.post('/team/update', {
        slots: [{
          index: pickerSlot,
          creatureSlug: creature.slug,
          moveId,
        }],
      });
      refetch();
    } catch (err) {
      console.error('Failed to update team slot:', err);
    }

    setPickerSlot(null);
  }, [pickerSlot, teamSlots, refetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-text-secondary text-sm">Caricamento...</span>
      </div>
    );
  }

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
    </div>
  );
}
