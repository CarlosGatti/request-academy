"use client";

import { useQuery } from "@apollo/client/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DefinedAcademiesDocument } from "@/graphql/generated/graphql";
import { clientEnv } from "@/lib/env/client";
import { toGraphQLInt } from "@/lib/graphql/ids";

const STORAGE_KEY = "defined_academy_admin_academy_id";
const CHANGE_EVENT = "defined-academy-admin-academy-change";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function getServerSnapshot() {
  return "";
}

function setStoredAcademyId(id: number | null) {
  if (id == null) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, String(id));
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

type AcademyRow = {
  id: number;
  slug: string;
  name: string;
  status: string;
};

type AdminAcademyContextValue = {
  academies: AcademyRow[];
  academyId: number | null;
  academy: AcademyRow | null;
  setAcademyId: (id: number | string) => void;
  loading: boolean;
  error: unknown;
};

const AdminAcademyContext = createContext<AdminAcademyContextValue | null>(null);

export function AdminAcademyProvider({ children }: { children: ReactNode }) {
  const storedId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { data, loading, error } = useQuery(DefinedAcademiesDocument);

  const academies = useMemo((): AcademyRow[] => {
    const rows: AcademyRow[] = [];
    for (const academy of data?.definedAcademies ?? []) {
      const id = toGraphQLInt(academy.id);
      if (id == null) continue;
      rows.push({
        id,
        slug: academy.slug,
        name: academy.name,
        status: academy.status,
      });
    }
    return rows;
  }, [data?.definedAcademies]);

  const academyId = useMemo(() => {
    const stored = toGraphQLInt(storedId);
    if (stored != null && academies.some((academy) => academy.id === stored)) {
      return stored;
    }
    const defaultSlug = clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG;
    const bySlug = academies.find((academy) => academy.slug === defaultSlug);
    return bySlug?.id ?? academies[0]?.id ?? null;
  }, [academies, storedId]);

  const academy = useMemo(
    () => academies.find((item) => item.id === academyId) ?? null,
    [academies, academyId],
  );

  const setAcademyId = useCallback((id: number | string) => {
    const next = toGraphQLInt(id);
    if (next == null) return;
    setStoredAcademyId(next);
  }, []);

  const value = useMemo(
    () => ({
      academies,
      academyId,
      academy,
      setAcademyId,
      loading,
      error,
    }),
    [academies, academyId, academy, setAcademyId, loading, error],
  );

  return (
    <AdminAcademyContext.Provider value={value}>
      {children}
    </AdminAcademyContext.Provider>
  );
}

export function useAdminAcademy() {
  const ctx = useContext(AdminAcademyContext);
  if (!ctx) {
    throw new Error("useAdminAcademy must be used within AdminAcademyProvider");
  }
  return ctx;
}
