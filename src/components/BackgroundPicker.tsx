import { BACKGROUND_OPTIONS } from "../lib/configLogic";
import type { BackgroundId } from "../lib/types";

export default function BackgroundPicker({
  value,
  onChange,
  onClose,
  variant = "inline",
}: {
  value: BackgroundId;
  onChange: (id: BackgroundId) => void;
  onClose?: () => void;
  variant?: "sheet" | "inline";
}) {
  const grid = (
    <div className={`bg-picker-grid bg-picker-${variant}`}>
      {BACKGROUND_OPTIONS.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            className={`bg-option${selected ? " is-selected" : ""}`}
            aria-pressed={selected}
            onClick={() => {
              onChange(option.id);
              if (variant === "sheet") onClose?.();
            }}
          >
            <span
              className="bg-option-thumb"
              data-bg={option.id}
              style={
                option.src
                  ? { backgroundImage: `url(${option.src})` }
                  : undefined
              }
            />
            <span className="bg-option-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (variant === "sheet") {
    return (
      <div className="bg-sheet-backdrop" onClick={onClose}>
        <div
          className="bg-sheet"
          role="dialog"
          aria-label="选择聊天背景"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="bg-sheet-handle" />
          <div className="bg-sheet-title">聊天背景</div>
          {grid}
          <button type="button" className="bg-sheet-done" onClick={onClose}>
            完成
          </button>
        </div>
      </div>
    );
  }

  return grid;
}
