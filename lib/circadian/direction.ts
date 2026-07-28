import type { Direction } from "./types";

/**
 * Maps a raw signed hour delta to the shortest arc in [-12, 12].
 *
 * Both +12 and -12 are reachable outputs (they represent the same physical
 * clock position, but which sign comes out depends on which side of the
 * modulus the input naturally falls on). Boundary behavior, verified by
 * hand and by tests:
 *   normalizeDelta(12)  === 12
 *   normalizeDelta(-12) === -12
 *   normalizeDelta(11)  === 11
 *   normalizeDelta(13)  === -11
 */
export function normalizeDelta(delta: number): number {
  let d = delta % 24;
  if (d > 12) d -= 24;
  else if (d < -12) d += 24;
  return d;
}

export function chooseDirection(delta: number): Direction {
  return normalizeDelta(delta) < 0 ? "delay" : "advance";
}

export function requiredShift(delta: number): number {
  return Math.abs(normalizeDelta(delta));
}
