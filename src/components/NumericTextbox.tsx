import { useCallback } from "react";

type NumericInputProps = {
  value: string; // allow for temporary empty string
  onChange: (next: string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
};

function NumericTextbox({
  value,
  onChange,
  min,
  max,
  placeholder = "0",
  className,
}: NumericInputProps) {
  // allow only digits while typing
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // allow empty string, else digits only
      if (raw === "" || /^[0-9]+$/.test(raw)) {
        onChange(raw);
      }
    },
    [onChange]
  );

  // prevent non-digits on keypress
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowed = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "Tab",
      ];
      if (allowed.includes(e.key)) return;
      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    },
    []
  );

  // get only the numeric values from pasted
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text");
      if (!/^[0-9]+$/.test(text)) e.preventDefault();
    },
    []
  );

  // clamp when out of range
  const handleBlur = useCallback(() => {
    if (value === "") return;
    let n = Number(value);
    if (Number.isFinite(min!)) n = Math.max(n, Number(min));
    if (Number.isFinite(max!)) n = Math.min(n, Number(max));
    onChange(String(n));
  }, [value, min, max, onChange]);

  return (
    <input
      type="text"
      inputMode="numeric" // mobile keypad
      pattern="[0-9]*" // reg expression for nums
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
    />
  );
}
export default NumericTextbox;
