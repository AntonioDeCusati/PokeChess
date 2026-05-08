import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';

interface BattleControlsProps {
  onSurrender?: () => void;
}

export function BattleControls({ onSurrender }: BattleControlsProps) {
  const nav = useNavigate();

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <Button variant="ghost" size="xs" onClick={() => nav('/home')}>
        ← Esci
      </Button>
      <Button variant="danger" size="xs" onClick={onSurrender}>
        Resa
      </Button>
    </div>
  );
}
