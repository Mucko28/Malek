import React, { useEffect, useState } from "react";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Save,
  Check,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  IceCream2,
} from "lucide-react";
import { BRAND } from "../mock";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = "malek_admin_token";

const DEFAULT_COLORS = [
  "#F4E4C5",
  "#F1E8D4",
  "#5A3A2A",
  "#D87A82",
  "#E8DEC9",
  "#A8C795",
  "#F0DC73",
  "#C4536A",
  "#F0A752",
  "#5C5A8E",
];

const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [booting, setBooting] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setBooting(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("bad token");
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
      setBooting(false);
    })();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-[#2a2724] text-white grid place-items-center">
        <div className="text-[11px] tracking-[0.4em] uppercase opacity-70">
          Ověřuji přístup…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <LoginScreen
          onSuccess={(t) => {
            localStorage.setItem(TOKEN_KEY, t);
            setToken(t);
          }}
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------
   Decorative aesthetic background shared by login + dashboard
------------------------------------------------------------------------- */
const AestheticBg = ({ variant = "light" }) => {
  const light = variant === "light";
  return (
    <>
      {/* Base gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: light
            ? "linear-gradient(180deg, #FBF5EC 0%, #F0E6D6 55%, #E7D9C2 100%)"
            : "linear-gradient(180deg, #2a2724 0%, #1a1816 100%)",
        }}
      />
      {/* Soft terracotta blob top-right */}
      <div
        className="absolute -top-40 -right-32 w-[640px] h-[640px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: light ? "rgba(196,107,91,0.22)" : "rgba(196,107,91,0.20)",
        }}
      />
      {/* Soft warm blob bottom-left */}
      <div
        className="absolute -bottom-56 -left-40 w-[720px] h-[720px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background: light ? "rgba(168,160,153,0.35)" : "rgba(168,160,153,0.18)",
        }}
      />
      {/* Subtle coffee blob centre-right */}
      <div
        className="absolute top-1/3 right-1/4 w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: light ? "#D8C4A8" : "#3a3430" }}
      />
      {/* Subtle noise grain via SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </>
  );
};

/* -------------------------------------------------------------------------
   Login screen
------------------------------------------------------------------------- */
const LoginScreen = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Chyba přihlášení");
      onSuccess(data.token);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid place-items-center p-6 overflow-hidden">
      <AestheticBg variant="dark" />

      {/* Rotating giant watermark behind */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
        <div
          className="font-display font-black text-white/[0.04] text-[22vw] leading-none tracking-tighter whitespace-nowrap"
          style={{ transform: "rotate(-6deg)" }}
        >
          MÁLEK · ADMIN
        </div>
      </div>

      <div className="relative w-full max-w-[460px]">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-white/55 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Zpět na web
        </a>

        <div className="mb-10 text-white">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#C46B5B] grid place-items-center shadow-[0_14px_30px_-10px_rgba(196,107,91,0.6)] rotate-3">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-white/55">
                {BRAND.name} · Admin
              </div>
              <div className="font-display font-black text-[32px] leading-none mt-2">
                Přihlášení
              </div>
            </div>
          </div>
          <p className="text-[14px] text-white/60 leading-relaxed max-w-[34ch]">
            Správa dnešní nabídky příchutí, které se zobrazují v úvodu webu.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="relative bg-white/[0.06] ring-1 ring-white/10 rounded-3xl p-7 md:p-8 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
        >
          <label className="block">
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/60">
              Uživatelské jméno
            </span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2.5 w-full bg-white/[0.06] ring-1 ring-white/10 rounded-2xl px-5 py-4 text-[16px] text-white outline-none focus:ring-2 focus:ring-[#C46B5B] transition-all"
              placeholder="Zmrkamalek"
              required
            />
          </label>

          <label className="block mt-6">
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/60">
              Heslo
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2.5 w-full bg-white/[0.06] ring-1 ring-white/10 rounded-2xl px-5 py-4 text-[16px] text-white outline-none focus:ring-2 focus:ring-[#C46B5B] transition-all"
              placeholder="••••••••"
              required
            />
          </label>

          {err && (
            <div className="mt-6 px-4 py-3 rounded-xl bg-[#C46B5B]/20 text-[#F7C4B5] text-[13px] ring-1 ring-[#C46B5B]/30">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-[#C46B5B] hover:bg-[#A8543F] disabled:opacity-60 text-white font-medium py-4 rounded-2xl text-[15px] tracking-wide transition-colors shadow-[0_14px_30px_-10px_rgba(196,107,91,0.5)]"
          >
            {loading ? "Přihlašuji…" : "Přihlásit se"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------
   Dashboard
------------------------------------------------------------------------- */
const Dashboard = ({ token, onLogout }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/flavours`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        setErr("Nelze načíst nabídku");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateItem = (idx, patch) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
    setSaved(false);
  };

  const addItem = () => {
    if (items.length >= 10) return;
    const nextColor = DEFAULT_COLORS[items.length % DEFAULT_COLORS.length];
    setItems((prev) => [...prev, { name: "", color: nextColor }]);
    setSaved(false);
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
    setSaved(false);
  };

  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    setItems((prev) => {
      const next = prev.slice();
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
    setSaved(false);
  };

  const save = async () => {
    setErr("");
    setSaving(true);
    try {
      const clean = items
        .map((it) => ({ name: (it.name || "").trim(), color: it.color }))
        .filter((it) => it.name.length > 0)
        .slice(0, 10);
      const res = await fetch(`${API}/flavours`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: clean }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Uložení selhalo");
      }
      const data = await res.json();
      setItems(data.items || []);
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#2a2724]">
      <AestheticBg variant="light" />

      {/* Decorative rotating word in the page background */}
      <div className="absolute top-[40vh] left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <div
          className="font-display font-black text-[#2a2724]/[0.05] text-[26vw] leading-none tracking-tighter whitespace-nowrap"
          style={{ transform: "rotate(-4deg)" }}
        >
          TOČENÁ RADOST
        </div>
      </div>

      {/* Header */}
      <header className="relative z-30 sticky top-0">
        <div className="bg-[#2a2724]/95 backdrop-blur-lg text-[#F4EFE8] border-b border-white/5">
          <div className="mx-auto max-w-[1080px] px-5 md:px-10 py-4 md:py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <a
                href="/"
                className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 ring-1 ring-white/10 grid place-items-center transition-colors shrink-0"
                title="Zpět na web"
              >
                <ArrowLeft className="w-5 h-5" />
              </a>
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">
                  {BRAND.name} · Admin
                </div>
                <div className="font-display font-black text-[20px] md:text-[22px] leading-none mt-1 truncate">
                  Dnešní nabídka
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2.5 bg-[#C46B5B] hover:bg-[#A8543F] disabled:opacity-60 text-white px-5 md:px-6 py-3 rounded-full text-[14px] font-semibold transition-all shadow-[0_8px_20px_-6px_rgba(196,107,91,0.5)] hover:shadow-[0_10px_25px_-6px_rgba(196,107,91,0.7)] hover:-translate-y-0.5"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Uloženo</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {saving ? "Ukládám…" : "Uložit"}
                    </span>
                    <span className="sm:hidden">
                      {saving ? "…" : "Uložit"}
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/15 ring-1 ring-white/10 text-white px-4 md:px-5 py-3 rounded-full text-[14px] transition-colors"
                title="Odhlásit"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Odhlásit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-[1080px] px-5 md:px-10 py-12 md:py-16">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-semibold">
              <span className="w-8 h-px bg-[#C46B5B]" />
              Příchutě v úvodu
            </div>
            <h2 className="font-display font-black text-[38px] md:text-[56px] leading-[0.95] mt-4">
              Upravte dnešní<br />
              <span className="text-[#C46B5B]">nabídku.</span>
            </h2>
            <p className="mt-5 text-[15px] text-[#2a2724]/70 max-w-[56ch] leading-relaxed">
              Až 10 položek. Zobrazují se postupně při scrollování úvodního
              videa — v pořadí, v jakém je nastavíte.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-display font-black text-[42px] md:text-[52px] leading-none text-[#2a2724] tabular-nums">
              {items.length}
              <span className="text-[#2a2724]/30">/10</span>
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#2a2724]/50 mt-1">
              položek
            </div>
          </div>
        </div>

        {err && (
          <div className="mb-5 px-5 py-4 rounded-2xl bg-[#C46B5B]/15 text-[#8A3A2A] text-[14px] ring-1 ring-[#C46B5B]/30 font-medium">
            {err}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-[#2a2724]/50 text-[11px] tracking-[0.3em] uppercase">
            Načítám…
          </div>
        ) : items.length === 0 ? (
          <EmptyState onAdd={addItem} />
        ) : (
          <ul className="space-y-3.5">
            {items.map((it, i) => (
              <FlavourRow
                key={i}
                idx={i}
                item={it}
                onChange={(p) => updateItem(i, p)}
                onRemove={() => removeItem(i)}
                onMoveUp={() => move(i, -1)}
                onMoveDown={() => move(i, 1)}
                isFirst={i === 0}
                isLast={i === items.length - 1}
              />
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              onClick={addItem}
              disabled={items.length >= 10}
              className="inline-flex items-center gap-2.5 bg-[#2a2724] hover:bg-[#1a1816] disabled:opacity-40 text-white px-6 py-4 rounded-full text-[14px] font-semibold transition-all hover:-translate-y-0.5 shadow-[0_10px_25px_-10px_rgba(42,39,36,0.5)]"
            >
              <span className="w-6 h-6 rounded-full bg-[#C46B5B] grid place-items-center">
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
              Přidat příchuť
            </button>

            {items.length >= 10 && (
              <span className="text-[13px] text-[#2a2724]/60">
                Dosažen maximální počet 10 položek.
              </span>
            )}
          </div>
        )}

        {/* Tip card */}
        <div className="mt-16 p-6 md:p-7 rounded-3xl bg-white/70 backdrop-blur ring-1 ring-[#2a2724]/10 shadow-[0_14px_40px_-14px_rgba(42,39,36,0.14)] flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#C46B5B] grid place-items-center text-white shrink-0 rotate-3">
            <IceCream2 className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#2a2724]/60 mb-2 font-semibold">
              Tip
            </div>
            <div className="text-[14.5px] text-[#2a2724]/80 leading-relaxed max-w-[66ch]">
              Barva je jen vizuální označení příchuti v úvodním panelu
              (kruhová ikonka). Vyberte odstín, který ji nejlépe vystihuje —
              nebo vlastní barvu přes paletu.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const EmptyState = ({ onAdd }) => (
  <div className="text-center py-16 bg-white/60 backdrop-blur rounded-3xl ring-1 ring-[#2a2724]/10">
    <div className="w-16 h-16 rounded-full bg-[#C46B5B]/20 grid place-items-center mx-auto mb-5">
      <IceCream2 className="w-7 h-7 text-[#C46B5B]" strokeWidth={1.8} />
    </div>
    <div className="font-display font-black text-[22px]">Zatím žádné příchutě</div>
    <p className="mt-2 text-[14px] text-[#2a2724]/60">
      Přidejte první položku dnešní nabídky.
    </p>
    <button
      onClick={onAdd}
      className="mt-6 inline-flex items-center gap-2.5 bg-[#2a2724] hover:bg-[#1a1816] text-white px-6 py-3.5 rounded-full text-[14px] font-semibold transition-colors"
    >
      <Plus className="w-4 h-4" />
      Přidat příchuť
    </button>
  </div>
);

/* -------------------------------------------------------------------------
   Row
------------------------------------------------------------------------- */
const FlavourRow = ({
  idx,
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  return (
    <li className="group flex items-center gap-4 md:gap-5 p-4 md:p-5 bg-white rounded-3xl ring-1 ring-[#2a2724]/8 hover:ring-[#2a2724]/25 hover:shadow-[0_14px_40px_-14px_rgba(42,39,36,0.15)] transition-all">
      {/* Order + move */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="w-8 h-8 rounded-full grid place-items-center text-[#2a2724]/40 hover:text-[#2a2724] hover:bg-[#2a2724]/5 disabled:opacity-25 disabled:pointer-events-none transition-colors"
          title="Posunout nahoru"
        >
          <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <span className="font-mono text-[11px] tabular-nums text-[#2a2724]/45 font-semibold">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="w-8 h-8 rounded-full grid place-items-center text-[#2a2724]/40 hover:text-[#2a2724] hover:bg-[#2a2724]/5 disabled:opacity-25 disabled:pointer-events-none transition-colors"
          title="Posunout dolů"
        >
          <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Color picker */}
      <ColorPicker
        value={item.color}
        onChange={(color) => onChange({ color })}
      />

      {/* Name */}
      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Název příchuti"
        className="flex-1 bg-transparent border-0 outline-none text-[20px] md:text-[22px] font-display font-bold placeholder:text-[#2a2724]/25 min-w-0 py-2"
        maxLength={60}
      />

      {/* Delete */}
      <button
        onClick={onRemove}
        className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-transparent hover:bg-[#C46B5B] text-[#2a2724]/40 hover:text-white grid place-items-center transition-all shrink-0"
        title="Odstranit"
      >
        <Trash2 className="w-5 h-5" strokeWidth={1.8} />
      </button>
    </li>
  );
};

/* -------------------------------------------------------------------------
   Color picker
------------------------------------------------------------------------- */
const ColorPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full ring-2 ring-[#2a2724]/10 hover:ring-[#2a2724]/40 hover:scale-105 transition-all overflow-hidden shadow-[0_6px_16px_-4px_rgba(42,39,36,0.15)]"
        style={{ background: value }}
        title="Vybrat barvu"
      >
        <span
          className="absolute inset-2 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), transparent 60%)",
          }}
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-[72px] z-40 bg-white ring-1 ring-[#2a2724]/10 rounded-3xl p-4 shadow-[0_30px_70px_-15px_rgba(42,39,36,0.3)] w-[280px]">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#2a2724]/50 font-semibold mb-3 px-1">
              Vyberte barvu
            </div>
            <div className="flex flex-wrap gap-2.5">
              {DEFAULT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                  className={`w-10 h-10 rounded-full transition-all ring-2 hover:scale-110 ${
                    value === c
                      ? "ring-[#2a2724]"
                      : "ring-transparent hover:ring-[#2a2724]/30"
                  }`}
                  style={{ background: c }}
                  title={c}
                />
              ))}
              <label className="w-10 h-10 rounded-full ring-2 ring-[#2a2724]/15 hover:ring-[#2a2724]/45 hover:scale-110 overflow-hidden cursor-pointer relative transition-all">
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #E94B7A, #F0A752, #F0DC73, #A8C795, #5C5A8E, #C4536A, #E94B7A)",
                  }}
                />
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
