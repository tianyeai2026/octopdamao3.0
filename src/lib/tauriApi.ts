import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";

import type { AppConfig, MascotId } from "./types";

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Native window/tray commands are desktop-only and are not registered on
// mobile. On mobile they resolve to a no-op.
const noop = async (): Promise<void> => {};

// Mobile runs a single window, so cross-window events are unnecessary and the
// Tauri event IPC is unavailable. On mobile we no-op emits and listens.
const safeEmit: typeof emit = isMobile
  ? (async () => {}) as typeof emit
  : emit;
const safeListen: typeof listen = isMobile
  ? (async () => () => {}) as typeof listen
  : listen;

export const tauriApi = {
  loadConfig: () => invoke<AppConfig>("load_config"),
  saveConfig: (cfg: AppConfig) => invoke<void>("save_config", { cfg }),
  patchConfig: (patch: Partial<AppConfig>) =>
    invoke<void>("patch_config", { patch }),
  getSecret: (key: string) => invoke<string | null>("get_secret", { key }),
  setSecret: (key: string, value: string) =>
    invoke<void>("set_secret", { key, value }),
  deleteSecret: (key: string) => invoke<void>("delete_secret", { key }),
  openHome: (baseUrl: string) =>
    isMobile ? noop() : invoke<void>("open_home", { baseUrl }),
  showChatNearPet: () =>
    isMobile ? noop() : invoke<void>("show_chat_near_pet"),
  hideChat: () => (isMobile ? noop() : invoke<void>("hide_chat")),
  hidePet: () => (isMobile ? noop() : invoke<void>("hide_pet")),
  showSettings: () => (isMobile ? noop() : invoke<void>("show_settings")),
  placeWindowBottomCenter: (label: string) =>
    isMobile
      ? noop()
      : invoke<void>("place_window_bottom_center", { label }),
  placeWindowCentered: (label: string) =>
    isMobile ? noop() : invoke<void>("place_window_centered", { label }),
  applyBottomAnchoredSize: (width: number, height: number, animate = false) =>
    isMobile
      ? noop()
      : invoke<void>("apply_bottom_anchored_size", { width, height, animate }),
  reloadHotkeys: () => (isMobile ? noop() : invoke<void>("reload_hotkeys")),
  applyWindowDeactivatePolicy: () =>
    isMobile ? noop() : invoke<void>("apply_window_deactivate_policy"),
  emitAuthUpdated: () => safeEmit("auth-updated"),
  listenAuthUpdated: (handler: () => void) => safeListen("auth-updated", handler),
  listenChatShown: (handler: () => void) => safeListen("chat-shown", handler),
  listenWindowShown: (event: string, handler: () => void) =>
    safeListen(event, handler),
  emitMascotChanged: (mascotId: MascotId) =>
    safeEmit("mascot-changed", mascotId),
  listenMascotChanged: (handler: (mascotId: MascotId) => void) =>
    safeListen<MascotId>("mascot-changed", ({ payload }) => handler(payload)),
};
