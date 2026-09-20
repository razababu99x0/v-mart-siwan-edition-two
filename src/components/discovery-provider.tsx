"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useShop } from "./shop-provider";
import { curateStyles, type LookBundle, type StylePreferences, type StyleProfile } from "@/lib/discovery";
const EMPTY_PROFILE: StyleProfile = { preferences: null, picks: [], savedAt: null };
type DiscoveryContextType = {
  studioOpen: boolean; setStudioOpen: (open: boolean) => void;
  profile: StyleProfile; profileReady: boolean; profileError: string; saving: boolean;
  savePreferences: (preferences: StylePreferences) => Promise<boolean>;
  clearPreferences: () => Promise<boolean>; loadProfile: () => Promise<void>;
  bundle: LookBundle | null; setBundle: (bundle: LookBundle | null) => void;
  viewedIds: string[]; historyReady: boolean; trackViewed: (id: string) => void; clearViewed: () => void;
};
const DiscoveryContext = createContext<DiscoveryContextType | null>(null);
export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const { ready, notify, products } = useShop();
  const [studioOpen, setStudioOpen] = useState(false);
  const [profile, setProfile] = useState<StyleProfile>(EMPTY_PROFILE);
  const [profileReady, setProfileReady] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [saving, setSaving] = useState(false);
  const [bundle, setBundle] = useState<LookBundle | null>(null);
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [historyReady, setHistoryReady] = useState(false);
  const loadProfile = useCallback(async () => {
    setProfileError("");
    try { const response = await fetch("/api/style", { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setProfile(data); }
    catch (error) { setProfileError(error instanceof Error ? error.message : "Your style edit couldn't load. Please try again."); }
    finally { setProfileReady(true); }
  }, []);
  useEffect(() => { if (ready) void loadProfile(); }, [ready, loadProfile]);
  useEffect(() => { try { const raw = JSON.parse(localStorage.getItem("vmart-recently-viewed") ?? "[]"); if (Array.isArray(raw)) setViewedIds(raw.filter(id => typeof id === "string").slice(0, 8)); } catch {} setHistoryReady(true); }, []);
  useEffect(() => { if (!historyReady) return; try { localStorage.setItem("vmart-recently-viewed", JSON.stringify(viewedIds)); } catch {} }, [viewedIds, historyReady]);
  const trackViewed = useCallback((id: string) => { setViewedIds(current => [id, ...current.filter(item => item !== id)].slice(0, 8)); }, []);
  const clearViewed = useCallback(() => { setViewedIds([]); notify("Your recently viewed history is cleared on this device."); }, [notify]);
  async function savePreferences(preferences: StylePreferences) {
    setSaving(true); setProfileError("");
    try { const response = await fetch("/api/style", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(preferences) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setProfile(data); return true; }
    catch (error) { setProfileError(error instanceof Error ? error.message : "Please try again."); return false; }
    finally { setSaving(false); }
  }
  async function clearPreferences() {
    setSaving(true); setProfileError("");
    try { const response = await fetch("/api/style", { method: "DELETE" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setProfile(data); notify("Your style preferences have been deleted."); return true; }
    catch (error) { setProfileError(error instanceof Error ? error.message : "Please try again."); return false; }
    finally { setSaving(false); }
  }
  return <DiscoveryContext.Provider value={{ studioOpen, setStudioOpen, profile: { ...profile, picks: profile.preferences ? curateStyles(products, profile.preferences) : [] }, profileReady, profileError, saving, savePreferences, clearPreferences, loadProfile, bundle, setBundle, viewedIds, historyReady, trackViewed, clearViewed }}>{children}</DiscoveryContext.Provider>;
}
export function useDiscovery() { const context = useContext(DiscoveryContext); if (!context) throw new Error("useDiscovery requires DiscoveryProvider"); return context; }
