import { isMobileDevice, windowCloseSide } from "../lib/platform";

import WindowCloseButton from "./WindowCloseButton";

export default function ChatChrome({
  onNewSession,
  newSessionDisabled,
  onPickBackground,
}: {
  onNewSession?: () => void;
  newSessionDisabled?: boolean;
  onPickBackground?: () => void;
}) {
  const mobile = isMobileDevice();
  const closeSide = windowCloseSide();
  const close = mobile ? <span className="chat-chrome-spacer" /> : <WindowCloseButton />;

  const newSession = onNewSession ? (
    <button
      type="button"
      className="chat-new-session"
      aria-label="新建会话"
      title="新建会话"
      disabled={newSessionDisabled}
      onClick={() => onNewSession()}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7v6M9 10h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  ) : (
    <span className="chat-chrome-spacer" />
  );

  const backgroundToggle = onPickBackground ? (
    <button
      type="button"
      className="chat-bg-toggle"
      aria-label="更换背景"
      title="更换背景"
      onClick={() => onPickBackground()}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="8.6" cy="9.2" r="1.7" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M21 15.5l-5.5-4.6-8.5 7.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  ) : (
    <span className="chat-chrome-spacer" />
  );

  return (
    <header
      className="chat-chrome"
      data-close-side={closeSide}
      data-mobile={mobile}
      data-tauri-drag-region
    >
      {closeSide === "start" && !mobile ? close : newSession}
      <div className="chat-chrome-drag" data-tauri-drag-region />
      <div className="chat-chrome-actions">
        {mobile ? backgroundToggle : null}
        {closeSide === "start" ? newSession : close}
      </div>
    </header>
  );
}
