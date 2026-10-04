import type { AppConfig, BackgroundId, MascotId } from "./types";

export const DEFAULT_APP_CONFIG: AppConfig = {
  baseUrl: "",
  username: "",
  mascotId: "peek",
  chatBackground: "default",
  lastAgentId: null,
  threadIdByAgent: {},
  petX: null,
  petY: null,
  petSize: 160,
  shortcutOpenPet: "CmdOrCtrl+Shift+O",
  shortcutOpenHome: "CmdOrCtrl+Shift+H",
  keepWindowsVisible: true,
};

export const MASCOT_SRC: Record<MascotId, string> = {
  peek: "/mascots/peek.webp",
  type: "/mascots/type.webp",
};

export const BACKGROUND_OPTIONS: Array<{
  id: BackgroundId;
  label: string;
  src?: string;
}> = [
  { id: "default", label: "默认深色" },
  { id: "sky", label: "蓝天白云", src: "/backgrounds/sky.webp" },
  { id: "soda", label: "气泡水", src: "/backgrounds/soda.webp" },
  { id: "doll", label: "娃娃与饮料", src: "/backgrounds/doll.webp" },
  { id: "mint", label: "薄荷奶昔", src: "/backgrounds/mint.webp" },
];

export const BACKGROUND_SRC: Partial<Record<BackgroundId, string>> =
  Object.fromEntries(
    BACKGROUND_OPTIONS.filter((option) => option.src).map((option) => [
      option.id,
      option.src,
    ]),
  );

export function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) throw new Error("服务地址不能为空");
  return trimmed;
}

export function resolveThreadForAgent(
  cfg: AppConfig,
  agentId: string,
): string | null {
  return cfg.threadIdByAgent[agentId] ?? null;
}

export function withThreadForAgent(
  cfg: AppConfig,
  agentId: string,
  threadId: string,
): AppConfig {
  return {
    ...cfg,
    lastAgentId: agentId,
    threadIdByAgent: { ...cfg.threadIdByAgent, [agentId]: threadId },
  };
}

export function withMascot(cfg: AppConfig, mascotId: MascotId): AppConfig {
  return { ...cfg, mascotId };
}
