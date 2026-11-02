import { useEffect, useState } from "react";

// Temporary review harness: flips the palette via ?__variant=… so each
// direction is a shareable link. Only renders when that param is present.
// Delete this folder (and its import in App.tsx) once a palette is chosen.

const GROUPS = [
  { heading: "Reference", variants: [{ id: "original", label: "Original" }] },
  {
    heading: "Emphasis",
    variants: [
      { id: "paper", label: "Gallery paper" },
      { id: "night", label: "Night studio" },
      { id: "ember", label: "Ember" },
    ],
  },
];
const ALL = GROUPS.flatMap((group) => group.variants);

const readParam = () => new URLSearchParams(window.location.search).get("__variant");

export function useVariantParam() {
  return typeof window !== "undefined" && readParam() !== null;
}

export default function VariantPicker() {
  const [active, setActive] = useState(() => (ALL.some((v) => v.id === readParam()) ? readParam()! : "original"));
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (active === "original") delete root.dataset.variant;
    else root.dataset.variant = active;
    const url = new URL(window.location.href);
    url.searchParams.set("__variant", active);
    window.history.replaceState(null, "", url);
  }, [active]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "h" || event.key === "H") {
        setHidden((value) => !value);
        return;
      }
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      setActive((current) => {
        const index = ALL.findIndex((v) => v.id === current);
        return ALL[(index + step + ALL.length) % ALL.length].id;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (hidden) return null;

  return (
    <div className="variant-picker-shell">
      <nav className="variant-picker" aria-label="Variants">
        {GROUPS.map((group) => (
          <div key={group.heading} className="variant-picker-group" role="group" aria-labelledby={`variants-${group.heading}`}>
            <span className="variant-picker-heading" id={`variants-${group.heading}`}>
              <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v4a3 3 0 0 0 3 3h7" />
                <path d="m10 7 3 3-3 3" />
              </svg>
              {group.heading}
            </span>
            {group.variants.map((variant) => (
              <button key={variant.id} type="button" aria-pressed={active === variant.id} onClick={() => setActive(variant.id)}>
                {variant.label}
              </button>
            ))}
          </div>
        ))}
        <p className="variant-picker-hint">←/→ to flip · H to hide</p>
      </nav>
      <div className="variant-picker-select">
        <select aria-label="Variant" value={active} onChange={(event) => setActive(event.target.value)}>
          {GROUPS.map((group) => (
            <optgroup key={group.heading} label={group.heading}>
              {group.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </div>
    </div>
  );
}
