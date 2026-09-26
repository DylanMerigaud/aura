import { describe, expect, it } from "vitest";
import { menuSlot } from "../../src/audio/menu-sfx";

describe("menuSlot", () => {
  it("plays cancel on a way back and confirm on anything else", () => {
    expect(menuSlot("BACK")).toBe("menuCancel");
    expect(menuSlot(" Quit to map")).toBe("menuCancel");
    expect(menuSlot("PLAY")).toBe("menuConfirm");
    expect(menuSlot("RETRY")).toBe("menuConfirm");
    expect(menuSlot("Background")).toBe("menuConfirm");
  });
});
