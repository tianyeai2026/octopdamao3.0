import {
  LogicalSize,
  PhysicalPosition,
  currentMonitor,
  getCurrentWindow,
} from "@tauri-apps/api/window";

import { tauriApi } from "./tauriApi";

export type ResizeEdge = "South" | "East" | "SouthEast";

export function getWindowLabel(): string {
  return getCurrentWindow().label;
}

/** Height (logical pixels) of the monitor containing the cursor, or null. */
export async function getCurrentMonitorWorkArea(): Promise<{
  height: number;
} | null> {
  try {
    const monitor = await currentMonitor();
    if (!monitor) return null;
    return { height: monitor.workArea.size.height / monitor.scaleFactor };
  } catch {
    return null;
  }
}

export async function hideCurrentWindow(): Promise<void> {
  // Mobile has a single window; hiding it would hide the whole app.
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
  await getCurrentWindow().hide();
}

export async function applyBottomAnchoredSize(size: {
  width: number;
  height: number;
  animate?: boolean;
}): Promise<void> {
  await tauriApi.applyBottomAnchoredSize(
    size.width,
    size.height,
    Boolean(size.animate),
  );
}

export async function setCurrentWindowResizable(
  resizable: boolean,
): Promise<void> {
  await getCurrentWindow()
    .setResizable(resizable)
    .catch(() => undefined);
}

export async function clearCurrentWindowMaxSize(): Promise<void> {
  await getCurrentWindow()
    .setMaxSize(null)
    .catch(() => undefined);
}

export async function setCurrentWindowMinSize(
  width: number,
  height: number,
): Promise<void> {
  await getCurrentWindow()
    .setMinSize(new LogicalSize(width, height))
    .catch(() => undefined);
}

export async function setCurrentWindowSize(
  width: number,
  height: number,
): Promise<void> {
  await getCurrentWindow()
    .setSize(new LogicalSize(width, height))
    .catch(() => undefined);
}

export async function startCurrentWindowResize(
  edge: ResizeEdge,
): Promise<void> {
  await getCurrentWindow()
    .startResizeDragging(edge)
    .catch(() => undefined);
}

export async function startCurrentWindowDrag(): Promise<void> {
  await getCurrentWindow()
    .startDragging()
    .catch(() => undefined);
}

export async function getCurrentWindowOuterPosition(): Promise<PhysicalPosition> {
  return getCurrentWindow().outerPosition();
}

export async function setCurrentWindowOuterPosition(
  position: PhysicalPosition,
): Promise<void> {
  await getCurrentWindow()
    .setPosition(position)
    .catch(() => undefined);
}
