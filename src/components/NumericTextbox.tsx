import { useCallback, useMemo } from "react";

type NumericInputProps = {
  value: string | number | undefined; // allow for temporary empty string
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
  const display = useMemo(() => (value === undefined || value === null ? "" : String(value)), [value]);
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
    if (typeof min === "number") n = Math.max(n, min);
    if (typeof max === "number") n = Math.min(n, max);
    onChange(String(n));
  }, [display, min, max, onChange]);

  return (
    <input
      type="text"
      inputMode="numeric" // mobile keypad
      pattern="[0-9]*" // reg expression for nums
      value={display}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onBlur={(e) => { 
    console.log('[blur]', e.target.value);
    handleBlur();
  }}
      placeholder={placeholder}
      className={className}
    />
  );
}
export default NumericTextbox;
