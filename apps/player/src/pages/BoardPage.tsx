import { useState } from 'react';
import {
  BoardTabs,
  CollezioneSection,
  ConfigurazioneSection,
  PrimaLineaSection,
} from '@/components/board';
import type { BoardTab } from '@/types';

/**
 * The Board screen ("Scacchiera").
 *
 * The "SCACCHIERA" tab (mockup #2) shows three stacked sections:
 *   1. Prima Linea  — 6 horizontally scrollable slots
 *   2. Configurazione — 3 cards (Supporto / Allenatore / Sfondo)
 *   3. Collezione — filterable creature grid
 *
 * The "COLLEZIONE" tab zooms into a larger, more browsable collection grid.
 */
export function BoardPage() {
  const [tab, setTab] = useState<BoardTab>('board');

  return (
    <div className="flex flex-col">
      <BoardTabs value={tab} onChange={setTab} />

      <div className="flex flex-col gap-3 px-3 py-3">
        {tab === 'board' ? (
          <>
            <PrimaLineaSection />
            <ConfigurazioneSection />
            <CollezioneSection />
          </>
        ) : (
          <CollezioneSection columns={4} />
        )}
      </div>
    </div>
  );
}
