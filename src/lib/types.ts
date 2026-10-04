export type MascotId = "peek" | "type";

export type BackgroundId =
  | "default"
  | "sky"
  | "soda"
  | "doll"
  | "mint"
  | "custom";

export type FontScale = "small" | "medium" | "large" | "xlarge";

export interface AppConfig {
  baseUrl: string;
  username: string;
  mascotId: MascotId;
  chatBackground: BackgroundId;
  fontScale: FontScale;
  /** 用户自定义背景图的 data URL；chatBackground 为 custom 时使用。 */
  customBackground: string;
  lastAgentId: string | null;
  threadIdByAgent: Record<string, string>;
  petX: number | null;
  petY: number | null;
  petSize: number;
  /** Tauri accelerator, e.g. CmdOrCtrl+Shift+O */
  shortcutOpenPet: string;
  /** Tauri accelerator, e.g. CmdOrCtrl+Shift+H */
  shortcutOpenHome: string;
  /** When true, chat/settings stay visible after clicking another app. */
  keepWindowsVisible: boolean;
}

export interface AgentSummary {
  id: string;
  name: string;
  state?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  pending?: boolean;
  error?: string;
}
