import { describe, it, expect } from "vitest";
import { gs1databar } from "@zplab/core/registry/gs1databar";

const ctx = (sx: number, sy: number) => ({ sx, sy, snap: (v: number) => v, nodeHeight: 0, anchor: null });
const leaf = (props: object) =>
  ({ id: "d", type: "gs1databar", x: 0, y: 0, rotation: 0, props: { content: "", symbology: 1, magnification: 2, rotation: "N", ...props } }) as never;
const mag = (r: unknown) => (r as { magnification: number }).magnification;

describe("gs1databar — width-only resize commit", () => {
  it("scales magnification with the horizontal drag", () => {
    expect(mag(gs1databar.commitTransform?.(leaf({}), ctx(2, 1)))).toBe(4);
  });

  it("ignores the vertical axis: height has no prop to land on", () => {
    expect(mag(gs1databar.commitTransform?.(leaf({}), ctx(1, 3)))).toBe(2);
  });

  it("clamps to the ^BR 1-10 range", () => {
    expect(mag(gs1databar.commitTransform?.(leaf({}), ctx(10, 1)))).toBe(10);
    expect(mag(gs1databar.commitTransform?.(leaf({}), ctx(0.1, 1)))).toBe(1);
  });

  it("reads the swapped axis under R/B rotation", () => {
    // R turns the bars a quarter: the screen-height drag is the module axis.
    expect(mag(gs1databar.commitTransform?.(leaf({ rotation: "R" }), ctx(1, 2)))).toBe(4);
    expect(mag(gs1databar.commitTransform?.(leaf({ rotation: "R" }), ctx(2, 1)))).toBe(2);
    expect(mag(gs1databar.commitTransform?.(leaf({ rotation: "B" }), ctx(1, 3)))).toBe(6);
  });
});
