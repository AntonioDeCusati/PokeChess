import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { BattleState } from '@/types/battle';
import { createBattleFromTeam, createMockBattle } from '@/services/battleService';
import type { NpcOpponentData } from '@/services/battleService';
import { BattleScene } from '@/game/battle/BattleScene';
import { PhaserBattle } from '@/components/battle/PhaserBattle';
import { BattleHud } from '@/components/battle/BattleHud';
import { SelectedPiecePanel } from '@/components/battle/SelectedPiecePanel';
import { InspectPiecePanel } from '@/components/battle/InspectPiecePanel';
import { BattleControls } from '@/components/battle/BattleControls';
import { BattleEndScreen } from '@/components/battle/BattleEndScreen';
import { SaveLoadModal } from '@/components/battle/SaveLoadModal';
import { api } from '@/lib/api';

interface BootstrapTeamSlot {
  index: number;
  creatureId: string;
  creatureSlug: string;
  moveId: string;
}

interface NpcBattleState {
  npcTrainerId?: string;
  difficulty?: string;
  npcName?: string;
}

export function BattlePage() {
  const location = useLocation();
  const npcState = (location.state as NpcBattleState) ?? {};

  const [state, setState] = useState<BattleState | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const sceneRef = useRef<BattleScene | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const bootstrap = await api.get<{
          creatures: any[];
          team: { slots: BootstrapTeamSlot[] };
          profile: { username: string };
        }>('/app/bootstrap');

        if (cancelled) return;

        // Build NPC opponent if navigating from campaign/training
        let npcOpponent: NpcOpponentData | undefined;
        if (npcState.npcTrainerId) {
          try {
            const npcRes = await api.get<{ trainer: any }>(`/npc-trainers/${npcState.npcTrainerId}`);
            const tier = npcState.difficulty ?? 'base';
            const npcSlots = (npcRes.trainer.slots ?? [])
              .filter((s: any) => s.tier === tier)
              .sort((a: any, b: any) => a.slotIndex - b.slotIndex);
            if (npcSlots.length > 0) {
              npcOpponent = {
                name: npcRes.trainer.name,
                team: npcSlots.map((s: any) => s.creature),
              };
            }
          } catch (err) {
            console.error('Failed to load NPC trainer:', err);
          }
        }

        if (bootstrap.team.slots.length > 0) {
          setState(createBattleFromTeam(
            bootstrap.team.slots,
            bootstrap.creatures,
            bootstrap.profile.username,
            npcOpponent,
          ));
        } else {
          setState(createMockBattle());
        }
      } catch (err) {
        console.error('Failed to load battle data:', err);
        if (!cancelled) setState(createMockBattle());
      }
    }

    init();
    return () => { cancelled = true; };
  }, [gameKey]);

  const selectedPiece = state?.selectedPieceId
    ? state.pieces.find((p) => p.id === state.selectedPieceId)
    : undefined;

  const inspectedPiece = state?.inspectedPieceId
    ? state.pieces.find((p) => p.id === state.inspectedPieceId)
    : undefined;

  const handleSceneReady = useCallback((scene: BattleScene) => {
    sceneRef.current = scene;
  }, []);

  const handleStateChange = useCallback((newState: BattleState) => {
    setState(newState);
  }, []);

  const handleCancel = useCallback(() => {
    sceneRef.current?.cancelSelection();
  }, []);

  const handleRematch = useCallback(() => {
    sceneRef.current = null;
    setState(null);
    setGameKey((k) => k + 1);
  }, []);

  // --- Save current game to DB ---
  const handleSave = useCallback(async () => {
    if (!state) return;
    setSaving(true);
    try {
      const turnLabel = `Turno ${state.turnNumber}`;
      const datePart = new Date().toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
      const name = `${state.player.name} vs ${state.opponent.name} - ${turnLabel} (${datePart})`;
      await api.post('/saves', { name, state });
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [state]);

  // --- Load a saved game from DB ---
  const handleLoadFromDb = useCallback((loadedState: unknown) => {
    sceneRef.current = null;
    setState(loadedState as BattleState);
    setGameKey((k) => k + 1);
    setShowLoadModal(false);
  }, []);

  // --- Export current state as downloadable JSON file ---
  const handleExport = useCallback(() => {
    if (!state) return;
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pokechess-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  // --- Import a JSON file to restore a game ---
  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.pieces && parsed.currentTurn) {
          sceneRef.current = null;
          setState(parsed as BattleState);
          setGameKey((k) => k + 1);
        } else {
          alert('File JSON non valido: manca la struttura della partita.');
        }
      } catch {
        alert('Errore nel parsing del file JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  if (!state) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base">
        <span className="text-text-secondary text-sm">Caricamento battaglia...</span>
      </div>
    );
  }

  const gameOver = state.status === 'won' || state.status === 'lost';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-base overflow-hidden">
      <BattleHud state={state} />

      <PhaserBattle
        key={gameKey}
        initialState={state}
        onStateChange={handleStateChange}
        onSceneReady={handleSceneReady}
      />

      {selectedPiece && !gameOver && (
        <div className="absolute bottom-12 left-0 right-0">
          <SelectedPiecePanel
            piece={selectedPiece}
            onMove={() => {}}
            onAbility={() => {}}
            onInfo={() => {}}
            onCancel={handleCancel}
          />
        </div>
      )}

      {!selectedPiece && inspectedPiece && !gameOver && (
        <div className="absolute bottom-12 left-0 right-0">
          <InspectPiecePanel piece={inspectedPiece} />
        </div>
      )}

      <BattleControls
        onSave={handleSave}
        onLoad={() => setShowLoadModal(true)}
        onExport={handleExport}
        onImport={handleImport}
        saving={saving}
      />

      {gameOver && (
        <BattleEndScreen state={state} onRematch={handleRematch} />
      )}

      {showLoadModal && (
        <SaveLoadModal
          onLoad={handleLoadFromDb}
          onClose={() => setShowLoadModal(false)}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
}
