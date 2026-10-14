import { useState } from 'react';
import { cn } from '@cloudflare/kumo';
import { CheckCircleIcon } from '@phosphor-icons/react';
import { OPERATORS, type Operator } from '../data/operators';

/** The operators as selectable cards: a coloured mark, the Persian name and the APN. */
export function OperatorPicker({ selected, onSelect }: { selected: Operator | null; onSelect: (operator: Operator) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {OPERATORS.map((op) => {
        const active = selected?.id === op.id;
        return (
          <button
            key={op.id}
            type="button"
            onClick={() => onSelect(op)}
            aria-pressed={active}
            className={cn(
              'relative flex flex-col items-start gap-2 rounded-2xl bg-kumo-base p-4 text-start ring transition-[box-shadow,background-color] duration-200',
              active ? 'ring-2 ring-kumo-brand' : 'ring-kumo-hairline hover:bg-kumo-tint',
            )}
          >
            <OperatorLogo operator={op} />
            <span className="text-sm font-bold text-kumo-default">{op.name}</span>
            <span className="ltr font-mono text-xs text-kumo-subtle">{op.apn}</span>
            {active && <CheckCircleIcon size={20} weight="fill" className="absolute top-3 end-3 text-kumo-link" />}
          </button>
        );
      })}
    </div>
  );
}

/** The operator's logo on white; its initial on the brand colour if the logo can't load. */
function OperatorLogo({ operator }: { operator: Operator }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="flex size-11 items-center justify-center rounded-xl text-base font-black text-white" style={{ backgroundColor: operator.color }}>
      {operator.name.slice(0, 1)}
    </span>
  ) : (
    <span className="flex size-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring ring-kumo-hairline">
      <img src={operator.logo} alt="" className="size-full object-contain" onError={() => setFailed(true)} referrerPolicy="no-referrer" />
    </span>
  );
}
