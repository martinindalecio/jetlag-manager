import { describe, it, expect, beforeEach } from "vitest";
import { getProfile, saveProfile, clearProfile } from "./profileStore";
import type { ChronotypeProfile } from "@/lib/circadian/types";

const validProfile: ChronotypeProfile = {
  workBedtime: "23:00",
  workWakeTime: "07:00",
  freeBedtime: "00:30",
  freeWakeTime: "08:30",
};

describe("profileStore", () => {
  beforeEach(() => {
    // Manually clear localStorage (jsdom doesn't support .clear() method directly)
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);
      if (key) window.localStorage.removeItem(key);
    }
  });

  describe("getProfile", () => {
    it("returns null when nothing is saved", () => {
      expect(getProfile()).toBeNull();
    });

    it("returns null for corrupted/invalid JSON", () => {
      window.localStorage.setItem("jetlag:profile", "not json");
      expect(getProfile()).toBeNull();
    });

    it("returns null for valid JSON missing required fields", () => {
      window.localStorage.setItem("jetlag:profile", JSON.stringify({ id: "123" }));
      expect(getProfile()).toBeNull();
    });

    it("returns null for invalid HH:MM format", () => {
      const badProfile = {
        id: "123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workBedtime: "25:00",
        workWakeTime: "07:00",
        freeBedtime: "00:30",
        freeWakeTime: "08:30",
      };
      window.localStorage.setItem("jetlag:profile", JSON.stringify(badProfile));
      expect(getProfile()).toBeNull();
    });
  });

  describe("saveProfile", () => {
    it("saves and returns a profile with generated id and timestamps", () => {
      const saved = saveProfile(validProfile);
      expect(saved).toMatchObject(validProfile);
      expect(saved.id).toBeTruthy();
      expect(saved.createdAt).toBeTruthy();
      expect(saved.updatedAt).toBeTruthy();
    });

    it("retrieves saved profile with getProfile", () => {
      const saved = saveProfile(validProfile);
      const retrieved = getProfile();
      expect(retrieved).toEqual(saved);
    });

    it("preserves id across multiple saves (update, not re-create)", () => {
      const first = saveProfile(validProfile);
      const firstId = first.id;
      const firstCreatedAt = first.createdAt;

      // Save again with the same profile
      const second = saveProfile(validProfile);
      expect(second.id).toBe(firstId);
      expect(second.createdAt).toBe(firstCreatedAt);
    });

    it("updates updatedAt timestamp on second save", () => {
      const first = saveProfile(validProfile);
      const firstUpdatedAt = first.updatedAt;

      // Small delay to ensure timestamp differs
      const later = new Promise((resolve) => setTimeout(resolve, 10));
      return later.then(() => {
        const second = saveProfile(validProfile);
        expect(second.updatedAt).not.toBe(firstUpdatedAt);
      });
    });

    it("throws on malformed input profile (programmer error)", () => {
      const badProfile = {
        workBedtime: "25:00", // invalid time
        workWakeTime: "07:00",
        freeBedtime: "00:30",
        freeWakeTime: "08:30",
      };
      expect(() => saveProfile(badProfile as ChronotypeProfile)).toThrow();
    });
  });

  describe("clearProfile", () => {
    it("removes profile from localStorage", () => {
      saveProfile(validProfile);
      expect(getProfile()).not.toBeNull();

      clearProfile();
      expect(getProfile()).toBeNull();
    });

    it("is safe to call when no profile exists", () => {
      expect(() => clearProfile()).not.toThrow();
    });
  });
});
