// src/components/CookieConsent.tsx
// GDPR-compliant cookie consent banner for Austria/EU

import React, { useEffect, useMemo, useState } from "react";
import {
  CONSENT_VERSION,
  defaultConsent,
  readConsent,
  writeConsent,
  type ConsentState,
} from "../lib/consent";

type Props = {
  privacyPolicyUrl?: string; // e.g. "/datenschutz"
  imprintUrl?: string;       // e.g. "/impressum"
};

function FocusTrapModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-2xl bg-white p-5 shadow-2xl m-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
            aria-label="Close preferences"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-700">{children}</div>
      </div>
    </div>
  );
}

export default function CookieConsent({
  privacyPolicyUrl = "/impressum/",
  imprintUrl = "/impressum/",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const [state, setState] = useState<ConsentState>(defaultConsent);

  const existing = useMemo(() => readConsent(), []);

  useEffect(() => {
    const record = readConsent();
    if (!record || record.version !== CONSENT_VERSION) {
      // Show banner if no consent or version changed
      setVisible(true);
      setState(record?.state ?? defaultConsent);
    } else {
      setVisible(false);
    }
  }, []);

  // Expose a global method so you can open preferences from footer link
  useEffect(() => {
    (window as any).openCookiePreferences = () => {
      const record = readConsent();
      setState(record?.state ?? defaultConsent);
      setPrefsOpen(true);
      setVisible(true); // Ensure banner context is available
    };
  }, []);

  const acceptAll = () => {
    writeConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
    setPrefsOpen(false);
  };

  const rejectAll = () => {
    writeConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
    setPrefsOpen(false);
  };

  const savePreferences = () => {
    writeConsent({ ...state, necessary: true });
    setVisible(false);
    setPrefsOpen(false);
  };

  // Preferences modal can be opened independently via window.openCookiePreferences()
  if (!visible && !prefsOpen) {
    return null;
  }

  return (
    <>
      {/* Banner */}
      {visible && !prefsOpen && (
        <div className="fixed inset-x-0 bottom-0 z-[999] p-3 sm:p-4">
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-base font-semibold text-gray-900">
                    Cookies & Datenschutz
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    Wir verwenden <b>notwendige Cookies</b>, damit die Website funktioniert.
                    Mit deiner Einwilligung nutzen wir außerdem optionale Cookies für{" "}
                    <b>Statistik/Analytics</b> und <b>Marketing</b>, um Inhalte zu verbessern
                    und Kampagnen zu messen. Du kannst deine Auswahl jederzeit ändern.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Mehr Infos:{" "}
                    <a className="underline hover:no-underline" href={privacyPolicyUrl}>
                      Datenschutz
                    </a>{" "}
                    ·{" "}
                    <a className="underline hover:no-underline" href={imprintUrl}>
                      Impressum
                    </a>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                  <button
                    onClick={() => setPrefsOpen(true)}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Einstellungen
                  </button>
                  <button
                    onClick={rejectAll}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Ablehnen
                  </button>
                  <button
                    onClick={acceptAll}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Alle akzeptieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <FocusTrapModal
        open={prefsOpen}
        title="Cookie-Einstellungen"
        onClose={() => setPrefsOpen(false)}
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">Notwendig</p>
                <p className="mt-1 text-xs text-gray-600">
                  Diese Cookies sind erforderlich (z.B. Sicherheit, Spracheinstellungen).
                </p>
              </div>
              <span className="text-xs font-semibold text-gray-500">Immer aktiv</span>
            </div>
          </div>

          <label className="block rounded-xl border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">Statistik / Analytics</p>
                <p className="mt-1 text-xs text-gray-600">
                  Hilft uns zu verstehen, welche Seiten gut funktionieren (z.B. Google Analytics).
                </p>
              </div>
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-purple-600"
                checked={state.analytics}
                onChange={(e) => setState((s) => ({ ...s, analytics: e.target.checked }))}
              />
            </div>
          </label>

          <label className="block rounded-xl border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">Marketing</p>
                <p className="mt-1 text-xs text-gray-600">
                  Wird verwendet, um Kampagnen zu messen und relevante Inhalte anzuzeigen (z.B. Meta Pixel).
                </p>
              </div>
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-purple-600"
                checked={state.marketing}
                onChange={(e) => setState((s) => ({ ...s, marketing: e.target.checked }))}
              />
            </div>
          </label>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-1">
            <button
              onClick={rejectAll}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Alles ablehnen
            </button>
            <button
              onClick={savePreferences}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Speichern
            </button>
          </div>

          <p className="text-[11px] text-gray-500">
            Version: {CONSENT_VERSION}
            {existing?.updatedAtISO ? ` · Letzte Auswahl: ${new Date(existing.updatedAtISO).toLocaleString("de-AT")}` : ""}
          </p>
        </div>
      </FocusTrapModal>
    </>
  );
}
