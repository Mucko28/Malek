import React, { useEffect, useState } from "react";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Save,
  Check,
  ArrowLeft,
  GripVertical,
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

  // On mount, verify stored token
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
    <div className="min-h-screen bg-[#F4EFE8] text-[#2a2724] font-sans">
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
    <div className="min-h-screen grid place-items-center bg-[#2a2724] text-[#F4EFE8] p-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#C46B5B]/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full bg-[#A8A099]/10 blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-white/55 hover:text-white mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Zpět na web
        </a>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-[#C46B5B] grid place-items-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-white/55">
                {BRAND.name} · Admin
              </div>
              <div className="font-display font-black text-[26px] leading-none mt-1">
                Přihlášení
              </div>
            </div>
          </div>
          <p className="text-[14px] text-white/55 leading-relaxed max-w-[34ch]">
            Správa dnešní nabídky příchutí, které se zobrazují v úvodu webu.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white/[0.04] ring-1 ring-white/10 rounded-3xl p-6 md:p-7 backdrop-blur-md"
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
              className="mt-2 w-full bg-white/[0.06] ring-1 ring-white/10 rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-[#C46B5B] transition-colors"
              placeholder="Zmrkamalek"
              required
            />
          </label>

          <label className="block mt-5">
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/60">
              Heslo
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-white/[0.06] ring-1 ring-white/10 rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-[#C46B5B] transition-colors"
              placeholder="••••••••"
              required
            />
          </label>

          {err && (
            <div className="mt-5 px-4 py-3 rounded-xl bg-[#C46B5B]/20 text-[#F7C4B5] text-[13px] ring-1 ring-[#C46B5B]/30">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#C46B5B] hover:bg-[#A8543F] disabled:opacity-60 text-white font-medium py-3.5 rounded-full transition-colors"
          >
            {loading ? "Přihlašuji…" : "Přihlásit se"}
          </button>
        </form>
      </div>
    </div>
  );
};

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
      // drop empty-name rows
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
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header bar */}
      <header className="sticky top-0 z-20 bg-[#2a2724] text-[#F4EFE8]">
        <div className="mx-auto max-w-[960px] px-6 md:px-10 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="/"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15 grid place-items-center transition-colors shrink-0"
              title="Zpět na web"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div className="min-w-0">
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">
                {BRAND.name} · Admin
              </div>
              <div className="font-display font-black text-[18px] leading-none mt-1 truncate">
                Dnešní nabídka
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#C46B5B] hover:bg-[#A8543F] disabled:opacity-60 text-white px-4 py-2 rounded-full text-[13px] font-medium transition-colors"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Uloženo
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {saving ? "Ukládám…" : "Uložit"}
                </>
              )}
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/15 ring-1 ring-white/10 text-white px-3.5 py-2 rounded-full text-[13px] transition-colors"
              title="Odhlásit"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Odhlásit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6 md:px-10 py-10 md:py-14">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium">
              Příchutě v úvodu
            </div>
            <h2 className="font-display font-black text-[32px] md:text-[44px] leading-[1] mt-3">
              Upravte dnešní ponuku
            </h2>
            <p className="mt-3 text-[14px] text-[#2a2724]/70 max-w-[56ch]">
              Až 10 položek. Zobrazují se postupně při scrollování hero videa
              na úvodní stránce — v pořadí, v jakém je nastavíte.
            </p>
          </div>
          <div className="shrink-0 font-mono text-[12px] text-[#2a2724]/55 tabular-nums">
            {items.length} / 10
          </div>
        </div>

        {err && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#C46B5B]/15 text-[#8A3A2A] text-[13px] ring-1 ring-[#C46B5B]/30">
            {err}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-[#2a2724]/50 text-[11px] tracking-[0.3em] uppercase">
            Načítám…
          </div>
        ) : (
          <ul className="space-y-3">
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

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={addItem}
            disabled={items.length >= 10}
            className="inline-flex items-center gap-2 bg-[#2a2724] hover:bg-[#1a1816] disabled:opacity-40 text-white px-5 py-3 rounded-full text-[13px] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Přidat příchuť
          </button>

          {items.length >= 10 && (
            <span className="text-[12px] text-[#2a2724]/60">
              Maximální počet je 10.
            </span>
          )}
        </div>

        <div className="mt-16 p-5 rounded-2xl bg-white ring-1 ring-[#2a2724]/10">
          <div className="text-[11px] tracking-[0.3em] uppercase text-[#2a2724]/60 mb-2">
            Tip
          </div>
          <div className="text-[14px] text-[#2a2724]/80 leading-relaxed">
            Barva je jen vizuální označení příchuti v úvodním panelu (kruhová
            ikonka). Vyberte barvu, která ji nejlépe vystihuje.
          </div>
        </div>
      </main>
    </div>
  );
};

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
    <li className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-2xl ring-1 ring-[#2a2724]/10 hover:ring-[#2a2724]/25 transition-all">
      <div className="flex flex-col items-center gap-1 text-[#2a2724]/40 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="disabled:opacity-30 hover:text-[#2a2724] transition-colors"
          title="Posunout nahoru"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="font-mono text-[10px] tabular-nums">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="disabled:opacity-30 hover:text-[#2a2724] transition-colors rotate-180"
          title="Posunout dolů"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      <ColorPicker
        value={item.color}
        onChange={(color) => onChange({ color })}
      />

      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Název příchuti"
        className="flex-1 bg-transparent border-0 outline-none text-[16px] font-display font-bold placeholder:text-[#2a2724]/30 min-w-0"
        maxLength={60}
      />

      <button
        onClick={onRemove}
        className="w-9 h-9 rounded-full bg-transparent hover:bg-[#C46B5B]/15 text-[#2a2724]/40 hover:text-[#C46B5B] grid place-items-center transition-colors shrink-0"
        title="Odstranit"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
};

const ColorPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-full ring-2 ring-[#2a2724]/15 hover:ring-[#2a2724]/40 transition-all relative overflow-hidden"
        style={{ background: value }}
        title="Barva"
      >
        <span
          className="absolute inset-1 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)",
          }}
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-12 z-20 bg-white ring-1 ring-[#2a2724]/15 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-wrap gap-2 w-[220px]">
            {DEFAULT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`w-8 h-8 rounded-full ring-2 transition-all ${
                  value === c
                    ? "ring-[#2a2724]"
                    : "ring-transparent hover:ring-[#2a2724]/30"
                }`}
                style={{ background: c }}
                title={c}
              />
            ))}
            <label className="w-8 h-8 rounded-full ring-2 ring-[#2a2724]/20 hover:ring-[#2a2724]/50 overflow-hidden cursor-pointer relative bg-gradient-to-br from-[#E94B7A] via-[#F0DC73] to-[#5C5A8E]">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
