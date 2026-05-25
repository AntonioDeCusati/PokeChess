import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';

interface BattleControlsProps {
  onSurrender?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  saving?: boolean;
}

export function BattleControls({ onSurrender, onSave, onLoad, onExport, onImport, saving }: BattleControlsProps) {
  const nav = useNavigate();

  return (
    <div className="flex items-center justify-between px-3 py-2 gap-1">
      <Button variant="ghost" size="xs" onClick={() => nav('/home')}>
        ← Esci
      </Button>

      <div className="flex items-center gap-1">
        {onSave && (
          <Button variant="ghost" size="xs" onClick={onSave} disabled={saving}>
            {saving ? '...' : '💾'}
          </Button>
        )}
        {onLoad && (
          <Button variant="ghost" size="xs" onClick={onLoad}>
            📂
          </Button>
        )}
        {onExport && (
          <Button variant="ghost" size="xs" onClick={onExport}>
            📤
          </Button>
        )}
        {onImport && (
          <Button variant="ghost" size="xs" onClick={onImport}>
            📥
          </Button>
        )}
        <Button variant="danger" size="xs" onClick={onSurrender}>
          Resa
        </Button>
      </div>
    </div>
  );
}
