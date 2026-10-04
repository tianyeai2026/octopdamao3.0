import React from "react";
import ReactDOM from "react-dom/client";

import "./App.css";
import { getWindowLabel } from "./lib/tauriWindowApi";
import ChatWindow from "./windows/ChatWindow";
import PetWindow from "./windows/PetWindow";
import SettingsWindow from "./windows/SettingsWindow";

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const label = isMobile ? "chat" : getWindowLabel();
document.documentElement.dataset.windowLabel = label;
if (isMobile) {
  document.documentElement.dataset.mobile = "true";
}

if (label === "pet") {
  const root = document.documentElement;
  root.style.background = "transparent";
  root.style.backgroundColor = "transparent";
  root.style.colorScheme = "normal";
  document.body.style.background = "transparent";
  document.body.style.backgroundColor = "transparent";
}

const root = isMobile ? (
  <ChatWindow />
) : label === "chat" ? (
  <ChatWindow />
) : label === "settings" ? (
  <SettingsWindow />
) : (
  <PetWindow />
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>{root}</React.StrictMode>,
);
