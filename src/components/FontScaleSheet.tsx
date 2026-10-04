import { FONT_SCALE_OPTIONS } from "../lib/configLogic";
import type { FontScale } from "../lib/types";

export default function FontScaleSheet({
  value,
  onChange,
  onClose,
}: {
  value: FontScale;
  onChange: (id: FontScale) => void;
  onClose: () => void;
}) {
  return (
    <div className="bg-sheet-backdrop" onClick={onClose}>
      <div
        className="bg-sheet"
        role="dialog"
        aria-label="字体大小"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-sheet-handle" />
        <div className="bg-sheet-title">字体大小</div>
        <div className="font-scale-sheet-grid">
          {FONT_SCALE_OPTIONS.map((option) => {
            const selected = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                className={`font-scale-sheet-btn${selected ? " is-selected" : ""}`}
                aria-pressed={selected}
                onClick={() => onChange(option.id)}
              >
                <span
                  className="font-scale-sheet-sample"
                  style={{ fontSize: `${Math.round(16 * option.scale)}px` }}
                >
                  A
                </span>
                <span className="font-scale-sheet-label">{option.label}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className="bg-sheet-done" onClick={onClose}>
          完成
        </button>
      </div>
    </div>
  );
}
