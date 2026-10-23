import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Content } from '../data/types';
import { defaultContent, LEGACY_AVATAR } from '../data/defaultContent';

const STORAGE_KEY = 'uiportfolio:content:v1';

type Updater = Content | ((prev: Content) => Content);

interface ContentCtx {
  content: Content;
  setContent: (next: Updater) => void;
  resetContent: () => void;
  storageError: string | null;
  isLocalDraft: boolean;
}

const Ctx = createContext<ContentCtx | null>(null);

/** Merge stored data with defaults so newly added fields never break older saves. */
export function normalizeContent(raw: Partial<Content>): Content {
  const profile = { ...defaultContent.profile, ...(raw.profile ?? {}) };
  if (!profile.avatar || profile.avatar === LEGACY_AVATAR) profile.avatar = defaultContent.profile.avatar;
  return {
    ...defaultContent,
    ...raw,
    profile,
    settings: { ...defaultContent.settings, ...(raw.settings ?? {}) },
  };
}

function loadLocal(): Content | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeContent(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [initialLocal] = useState(loadLocal);
  const [content, setContentState] = useState<Content>(initialLocal ?? defaultContent);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isLocalDraft, setIsLocalDraft] = useState(Boolean(initialLocal));
  const dirty = useRef(false);

  // No local edits in this browser? Load the published /content.json exported from the admin panel, if any.
  useEffect(() => {
    if (initialLocal) return;
    fetch('/content.json', { cache: 'no-store' })
      .then((r) => (r.ok && r.headers.get('content-type')?.includes('json') ? r.json() : null))
      .then((data) => {
        if (data && data.profile && !dirty.current) setContentState(normalizeContent(data));
      })
      .catch(() => undefined);
  }, [initialLocal]);

  useEffect(() => {
    if (!dirty.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setStorageError(null);
      setIsLocalDraft(true);
    } catch {
      setStorageError(
        'Browser storage is full. Use image URLs instead of uploads, or remove some images, then save again.',
      );
    }
  }, [content]);

  const setContent = useCallback((next: Updater) => {
    dirty.current = true;
    setContentState(next);
  }, []);

  const resetContent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dirty.current = false;
    setIsLocalDraft(false);
    setContentState(defaultContent);
  }, []);

  useEffect(() => {
    document.title = content.settings.siteTitle || `${content.profile.name} | ${content.profile.role}`;
  }, [content.settings.siteTitle, content.profile.name, content.profile.role]);

  return (
    <Ctx.Provider value={{ content, setContent, resetContent, storageError, isLocalDraft }}>{children}</Ctx.Provider>
  );
}

export function useContent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
