import { ChronotypeProfileSchema, ProfileRecordSchema, type ProfileRecord } from "./schema";
import type { ChronotypeProfile } from "@/lib/circadian/types";

const KEY = "jetlag:profile";

export function getProfile(): ProfileRecord | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = ProfileRecordSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: ChronotypeProfile): ProfileRecord {
  ChronotypeProfileSchema.parse(profile); // throws if the input itself is malformed — this is a programmer error, not a storage-corruption case
  const existing = getProfile();
  const now = new Date().toISOString();
  const record: ProfileRecord = {
    ...profile,
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(record));
  }
  return record;
}

export function clearProfile(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
