import { useEffect, useMemo, useRef, useState } from "react";

type SelectProps = {
  options: string[];
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  showClearOption?: boolean;
  clearLabel?: string;

  // sizing/styling overrides
  wrapperClassName?: string; // size of box
  inputClassName?: string; // height/padding/font of input
  listClassName?: string; // dropdown width/height
  optionClassName?: string; // option row padding/height
  dropdownWidth?: number | string; // inline width (e.g. 320 or "20rem")
  maxListHeight?: number | string; // inline max-height (e.g. 240 or "16rem")
};

function TypePickBox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  label,
  disabled,
  showClearOption = true,
  clearLabel = "Clear",

  wrapperClassName,
  inputClassName,
  listClassName,
  optionClassName,
  dropdownWidth,
  maxListHeight,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastValidRef = useRef<string>(value);
  const clear = () => {
    onChange("");
    lastValidRef.current = "";
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    setQuery(value);
    lastValidRef.current = value;
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const handleFocus = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(0);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!wrapRef.current?.contains(document.activeElement)) {
        commitOrRevert();
        setOpen(false);
      }
    }, 0);
  };

  const commitOrRevert = () => {
    const exact = options.find(
      (o) => o.toLowerCase() === query.trim().toLowerCase()
    );
    if (exact) {
      onChange(exact);
      lastValidRef.current = exact;
      setQuery(exact);
    } else {
      // keep free-typed text if you want; or revert to lastValidRef.current
      // setQuery(lastValidRef.current ?? "");
      // onChange(lastValidRef.current ?? "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) =>
          Math.min(i + 1, Math.max(0, filtered.length - 1))
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        if (open && filtered[activeIndex]) {
          e.preventDefault();
          select(filtered[activeIndex]);
        } else {
          commitOrRevert();
        }
        break;
      case "Escape":
        setOpen(false);
        setQuery(lastValidRef.current ?? "");
        break;
    }
  };

  const select = (opt: string) => {
    onChange(opt);
    lastValidRef.current = opt;
    setQuery(opt);
    setOpen(false);
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div
      ref={wrapRef}
      className={`relative ${wrapperClassName ?? "w-full max-w-sm"}`}
    >
      {label && (
        <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-md bg-white px-3 py-2 text-sm outline-none
                    focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500
                    ${inputClassName ?? ""}`}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls="ac-listbox"
        aria-activedescendant={open ? `ac-opt-${activeIndex}` : undefined}
      />

      {open && (
        <ul
          id="ac-listbox"
          role="listbox"
          className={`absolute z-50 mt-1 w-full max-h-60 overflow-auto overscroll-contain rounded-md border border-zinc-200 bg-white p-1 text-sm shadow-lg
                      dark:border-zinc-700 dark:bg-zinc-900 ${
                        listClassName ?? "max-h-60"
                      }`}
          style={{
            width: dropdownWidth ?? undefined,
            maxHeight: maxListHeight ?? undefined,
          }}
        >
          {/* Clear option */}
          {showClearOption && (
            <li
              role="option"
              aria-selected={false}
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={clear}
              onMouseEnter={() => setActiveIndex(-1)}
              className="mb-1 cursor-pointer select-none rounded px-2 py-1 text-zinc-400 bg-zinc-100 hover:bg-zinc-300 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {clearLabel}
            </li>
          )}
          {filtered.length === 0 ? (
            <li className="cursor-default select-none px-2 py-2 text-zinc-500 dark:text-zinc-400">
              No matches
            </li>
          ) : (
            filtered.map((opt, i) => {
              const active = i === activeIndex;
              return (
                <li
                  id={`ac-opt-${i}`}
                  key={opt}
                  role="option"
                  aria-selected={active}
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(opt)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`cursor-pointer select-none rounded px-2 py-1
                              ${
                                activeIndex === i
                                  ? "bg-zinc-200 dark:bg-zinc-700"
                                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              }
                              ${optionClassName ?? ""}`}
                >
                  {opt}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

export default TypePickBox;
