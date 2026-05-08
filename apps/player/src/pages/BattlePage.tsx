import { useCallback, useRef, useState } from 'react';
import type { BattleState } from '@/types/battle';
import { createMockBattle } from '@/services/battleService';
import { BattleScene } from '@/game/battle/BattleScene';
import { PhaserBattle } from '@/components/battle/PhaserBattle';
import { BattleHud } from '@/components/battle/BattleHud';
import { SelectedPiecePanel } from '@/components/battle/SelectedPiecePanel';
import { InspectPiecePanel } from '@/components/battle/InspectPiecePanel';
import { BattleControls } from '@/components/battle/BattleControls';

export function BattlePage() {
  const [state, setState] = useState<BattleState>(createMockBattle);
  const sceneRef = useRef<BattleScene | null>(null);

  const selectedPiece = state.selectedPieceId
    ? state.pieces.find((p) => p.id === state.selectedPieceId)
    : undefined;

  const inspectedPiece = state.inspectedPieceId
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-base overflow-hidden">
      {/* HUD overlay — top */}
      <BattleHud state={state} />

      {/* Phaser canvas — fills remaining space */}
      <PhaserBattle
        initialState={state}
        onStateChange={handleStateChange}
        onSceneReady={handleSceneReady}
      />

      {/* Selected piece panel — bottom overlay */}
      {selectedPiece && (
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

      {/* Inspect opponent piece — bottom overlay */}
      {!selectedPiece && inspectedPiece && (
        <div className="absolute bottom-12 left-0 right-0">
          <InspectPiecePanel piece={inspectedPiece} />
        </div>
      )}

      {/* Controls — bottom */}
      <BattleControls />
    </div>
  );
}
