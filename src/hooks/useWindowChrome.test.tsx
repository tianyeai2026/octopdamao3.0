// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  setCurrentWindowSize: vi.fn(),
  placeWindowCentered: vi.fn(),
  getCurrentMonitorWorkArea: vi.fn(),
  getWindowLabel: vi.fn(() => "settings"),
  listenWindowShown: vi.fn(),
}));

vi.mock("../lib/tauriApi", () => ({
  tauriApi: {
    placeWindowCentered: mocks.placeWindowCentered,
    listenWindowShown: mocks.listenWindowShown,
  },
}));

vi.mock("../lib/tauriWindowApi", () => ({
  setCurrentWindowSize: mocks.setCurrentWindowSize,
  getCurrentMonitorWorkArea: mocks.getCurrentMonitorWorkArea,
  getWindowLabel: mocks.getWindowLabel,
}));

import { useAutoFitWindow } from "./useWindowChrome";

function Harness() {
  const ref = createRef<HTMLElement>();
  useAutoFitWindow(ref as React.RefObject<HTMLElement>, 480, []);
  return (
    <main className="settings-window" ref={ref as React.RefObject<HTMLElement>}>
      <nav className="settings-tabs-bar">tabs</nav>
      <div className="settings-frame">panel content</div>
    </main>
  );
}

/** Mock layout: window 360 tall, frame shows 292, holds `content` naturally. */
function mockLayout(content: number, window = 360, frameClient = 292) {
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("settings-window") ? window : 0;
    },
  );
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("settings-frame") ? frameClient : 0;
    },
  );
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("settings-frame") ? content : 0;
    },
  );
}

describe("useAutoFitWindow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.setCurrentWindowSize.mockResolvedValue(undefined);
    mocks.placeWindowCentered.mockResolvedValue(undefined);
    mocks.listenWindowShown.mockResolvedValue(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clamps the window to the work area and recenters when content is taller", async () => {
    mocks.getCurrentMonitorWorkArea.mockResolvedValue({ height: 600 });
    // natural = 360 - 292 + 795 = 863; clamped to 600.
    mockLayout(795);

    render(<Harness />);

    await waitFor(() =>
      expect(mocks.setCurrentWindowSize).toHaveBeenCalledWith(480, 600),
    );
    expect(mocks.placeWindowCentered).toHaveBeenCalledWith("settings");
  });

  it("uses the natural content height when it fits the work area", async () => {
    mocks.getCurrentMonitorWorkArea.mockResolvedValue({ height: 1032 });
    mockLayout(795);

    render(<Harness />);

    await waitFor(() =>
      expect(mocks.setCurrentWindowSize).toHaveBeenCalledWith(480, 863),
    );
  });

  it("falls back to natural height when the monitor is unavailable", async () => {
    mocks.getCurrentMonitorWorkArea.mockResolvedValue(null);
    mockLayout(795);

    render(<Harness />);

    await waitFor(() =>
      expect(mocks.setCurrentWindowSize).toHaveBeenCalledWith(480, 863),
    );
  });

  it("does not resize when content is shorter than the minimum", async () => {
    mocks.getCurrentMonitorWorkArea.mockResolvedValue({ height: 1032 });
    // natural = 100 - 50 + 50 = 100.
    mockLayout(50, 100, 50);

    render(<Harness />);

    await waitFor(() =>
      expect(mocks.setCurrentWindowSize).not.toHaveBeenCalled(),
    );
  });
});
