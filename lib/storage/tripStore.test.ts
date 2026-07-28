import { describe, it, expect, beforeEach } from "vitest";
import { listTrips, getTrip, saveTrip, deleteTrip } from "./tripStore";
import type { Plan } from "@/lib/circadian/types";

const validPlan: Plan = {
  direction: "delay",
  requiredShift: 3,
  maxDaily: 1.5,
  nDaysPlanned: 2,
  nDaysActual: 2,
  recommendations: [],
};

const tripInput = {
  label: "New York → Tokyo",
  originCityId: "nyc",
  destCityId: "tyo",
  arriveUTC: "2025-08-01T18:30:00Z",
  availableDays: 7,
};

describe("tripStore", () => {
  beforeEach(() => {
    // Manually clear localStorage (jsdom doesn't support .clear() method directly)
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);
      if (key) window.localStorage.removeItem(key);
    }
  });

  describe("listTrips", () => {
    it("returns empty array when no trips saved", () => {
      expect(listTrips()).toEqual([]);
    });

    it("returns empty array for corrupted/invalid JSON", () => {
      window.localStorage.setItem("jetlag:trips", "not json");
      expect(listTrips()).toEqual([]);
    });

    it("returns empty array for non-array value", () => {
      window.localStorage.setItem("jetlag:trips", JSON.stringify({ id: "123" }));
      expect(listTrips()).toEqual([]);
    });

    it("drops corrupted entries while preserving valid ones", () => {
      const validTrip = {
        id: "trip1",
        label: "Trip 1",
        originCityId: "a",
        destCityId: "b",
        arriveUTC: "2025-08-01T18:30:00Z",
        createdAt: new Date().toISOString(),
        plan: validPlan,
      };

      const corruptedTrip = {
        id: "trip2",
        label: "Trip 2",
        // missing required fields like originCityId, destCityId, arriveUTC, createdAt, plan
      };

      const arrayWithMixed = [validTrip, corruptedTrip];
      window.localStorage.setItem("jetlag:trips", JSON.stringify(arrayWithMixed));

      const trips = listTrips();
      expect(trips).toHaveLength(1);
      expect(trips[0].id).toBe("trip1");
      expect(trips[0].label).toBe("Trip 1");
    });
  });

  describe("saveTrip", () => {
    it("saves a trip and retrieves it", () => {
      const saved = saveTrip(tripInput, validPlan);
      expect(saved).toMatchObject(tripInput);
      expect(saved.id).toBeTruthy();
      expect(saved.createdAt).toBeTruthy();
      expect(saved.plan).toEqual(validPlan);
    });

    it("accumulates multiple trips", () => {
      const trip1 = saveTrip(tripInput, validPlan);
      const trip2 = saveTrip(
        {
          label: "Tokyo → London",
          originCityId: "tyo",
          destCityId: "lhr",
          arriveUTC: "2025-08-10T09:00:00Z",
        },
        validPlan
      );

      const all = listTrips();
      expect(all).toHaveLength(2);
      expect(all.map((t) => t.id)).toContain(trip1.id);
      expect(all.map((t) => t.id)).toContain(trip2.id);
    });

    it("generates unique IDs for each trip", () => {
      const trip1 = saveTrip(tripInput, validPlan);
      const trip2 = saveTrip(tripInput, validPlan);
      expect(trip1.id).not.toBe(trip2.id);
    });

    it("throws on malformed trip input (programmer error)", () => {
      expect(() =>
        saveTrip(
          {
            label: "Test",
            originCityId: "a",
            destCityId: "b",
            arriveUTC: "not-a-date",
          },
          validPlan
        )
      ).toThrow();
    });
  });

  describe("getTrip", () => {
    it("returns trip by id", () => {
      const saved = saveTrip(tripInput, validPlan);
      const retrieved = getTrip(saved.id);
      expect(retrieved).toEqual(saved);
    });

    it("returns null for non-existent id", () => {
      expect(getTrip("nonexistent")).toBeNull();
    });

    it("returns the correct trip from multiple saved trips", () => {
      const trip1 = saveTrip(tripInput, validPlan);
      const trip2 = saveTrip(
        {
          label: "Different trip",
          originCityId: "jfk",
          destCityId: "nrt",
          arriveUTC: "2025-09-01T12:00:00Z",
        },
        validPlan
      );

      expect(getTrip(trip1.id)).toEqual(trip1);
      expect(getTrip(trip2.id)).toEqual(trip2);
    });
  });

  describe("deleteTrip", () => {
    it("removes a trip by id", () => {
      const trip = saveTrip(tripInput, validPlan);
      expect(listTrips()).toHaveLength(1);

      deleteTrip(trip.id);
      expect(listTrips()).toHaveLength(0);
      expect(getTrip(trip.id)).toBeNull();
    });

    it("removes only the targeted trip when multiple exist", () => {
      const trip1 = saveTrip(tripInput, validPlan);
      const trip2 = saveTrip(
        {
          label: "Another trip",
          originCityId: "lax",
          destCityId: "nrt",
          arriveUTC: "2025-08-15T10:00:00Z",
        },
        validPlan
      );

      deleteTrip(trip1.id);
      const remaining = listTrips();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe(trip2.id);
    });

    it("is safe to delete a non-existent trip", () => {
      expect(() => deleteTrip("nonexistent")).not.toThrow();
      expect(listTrips()).toEqual([]);
    });
  });

  describe("integration: save, list, get, delete flow", () => {
    it("handles a complete workflow", () => {
      // Save two trips
      const trip1 = saveTrip(tripInput, validPlan);
      const trip2 = saveTrip(
        {
          label: "Return trip",
          originCityId: "tyo",
          destCityId: "nyc",
          arriveUTC: "2025-08-20T14:00:00Z",
        },
        validPlan
      );

      // List all
      expect(listTrips()).toHaveLength(2);

      // Get specific trip
      expect(getTrip(trip1.id)).toEqual(trip1);
      expect(getTrip(trip2.id)).toEqual(trip2);

      // Delete one
      deleteTrip(trip1.id);
      expect(listTrips()).toHaveLength(1);
      expect(getTrip(trip1.id)).toBeNull();
      expect(getTrip(trip2.id)).not.toBeNull();

      // Delete the other
      deleteTrip(trip2.id);
      expect(listTrips()).toHaveLength(0);
    });
  });
});
