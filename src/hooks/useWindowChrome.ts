import { type RefObject, useEffect, useLayoutEffect } from "react";

import { tauriApi } from "../lib/tauriApi";
import {
  getCurrentMonitorWorkArea,
  getWindowLabel,
  hideCurrentWindow,
  setCurrentWindowSize,
} from "../lib/tauriWindowApi";

export function useAutoFitWindow(
  rootRef: RefObject<HTMLElement | null>,
  width: number,
  deps: unknown[] = [],
  shownEvent = "settings-shown",
  scrollContainerSelector = ".settings-frame",
) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  useLayoutEffect(() => {
    if (isMobile) return;
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let running = false;
    let disposed = false;
    let lastHeight = 0;
    let stableRounds = 0;

    /** Natural window height: surrounding chrome + the panel's full content. */
    function measureNatural(): number {
      const el = root;
      if (!el) return 0;
      const scrollContainer = scrollContainerSelector
        ? (el.querySelector(scrollContainerSelector) as HTMLElement | null)
        : null;
      if (scrollContainer) {
        // The scroll container clips its content, so its overflow is not part
        // of root.scrollHeight. Use its own scrollHeight plus the surrounding
        // chrome: root padding/borders, tabs bar, frame borders.
        return Math.ceil(
          el.offsetHeight -
            scrollContainer.clientHeight +
            scrollContainer.scrollHeight,
        );
      }
      const border = el.offsetHeight - el.clientHeight;
      return Math.ceil(el.scrollHeight + border);
    }

    const fit = async () => {
      if (running || disposed) return;
      running = true;
      let changed = false;
      try {
        const natural = measureNatural();
        if (natural >= 120) {
          let height = natural;
          const workArea = await getCurrentMonitorWorkArea();
          if (workArea) {
            // Never request a window taller than the monitor work area.
            height = Math.min(natural, Math.floor(workArea.height));
          }
          if (height !== lastHeight) {
            await setCurrentWindowSize(width, height);
            lastHeight = height;
            // Re-center so a taller/shorter panel stays fully on screen.
            await tauriApi.placeWindowCentered(getWindowLabel());
            changed = true;
          }
        }

        const el = root;
        const scrollContainer =
          el && scrollContainerSelector
            ? (el.querySelector(scrollContainerSelector) as HTMLElement | null)
            : null;
        if (
          scrollContainer &&
          scrollContainer.scrollHeight <= scrollContainer.clientHeight
        ) {
          // Everything fits; do not leave the frame scrolled to the bottom.
          scrollContainer.scrollTop = 0;
        }
      } finally {
        running = false;
      }

      stableRounds = changed ? 0 : stableRounds + 1;
      // Re-check after layout settles: a transient reflow can report a wrong
      // (too small) height and otherwise leave the window permanently short.
      if (stableRounds < 2) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            void fit();
          }),
        );
      }
    };

    // Double rAF so the measurement runs after the current layout settles.
    const scheduleFit = () => {
      stableRounds = 0;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          void fit();
        }),
      );
    };

    scheduleFit();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleFit);
    observer?.observe(root);

    let unlistenShown: (() => void) | undefined;
    void tauriApi
      .listenWindowShown(shownEvent, scheduleFit)
      .then((unlisten) => {
        if (disposed) unlisten();
        else unlistenShown = unlisten;
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      unlistenShown?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- explicit layout deps
  }, deps);
}

export function useEscapeHidesWindow() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        void hideCurrentWindow();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
