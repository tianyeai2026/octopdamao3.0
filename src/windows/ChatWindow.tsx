import Composer from "../components/Composer";
import ChatChrome from "../components/ChatChrome";
import ChatResizeChrome from "../components/ChatResizeChrome";
import MessageList from "../components/MessageList";
import QueuedMessages from "../components/QueuedMessages";
import { useChatController } from "../hooks/useChatController";
import { useEscapeHidesWindow } from "../hooks/useWindowChrome";
import { removeChatItem } from "../lib/messageQueue";
import SettingsWindow from "./SettingsWindow";

export default function ChatWindow() {
  const chat = useChatController();
  useEscapeHidesWindow();

  if (chat.needsSettings) {
    return <SettingsWindow onSaved={() => chat.retryInitialize()} />;
  }

  return (
    <main
      className={`chat-window${chat.layoutExpanded ? " is-expanded" : " is-compact"}`}
      ref={chat.rootRef}
    >
      <ChatChrome
        onNewSession={() => void chat.startNewSession()}
        newSessionDisabled={
          chat.loadingHistory || chat.connection === "streaming"
        }
      />
      <div className="chat-body">
        {chat.error ? (
          <div className="chat-error" role="alert">
            <p>{chat.error}</p>
            {chat.canRetryInit ? (
              <button
                type="button"
                className="chat-error-retry"
                onClick={() => void chat.retryInitialize()}
              >
                重试
              </button>
            ) : null}
          </div>
        ) : null}
        <MessageList
          messages={chat.messages}
          loading={chat.loadingHistory}
          actionsDisabled={chat.connection === "streaming"}
          speakingId={chat.speakingId}
          statusLabel={chat.statusLabel}
          onRetry={chat.retryAssistant}
          onSpeak={chat.speakMessage}
        />
      </div>
      <QueuedMessages
        items={chat.queue}
        onRemove={(id) =>
          chat.setQueue((current) => removeChatItem(current, id))
        }
      />
      <Composer
        agents={chat.agents}
        agentId={chat.agentId}
        onAgentChange={(id) => void chat.openAgent(id)}
        models={chat.models}
        connectors={chat.connectors}
        attachments={chat.attachments}
        onAttachmentsChange={chat.setAttachments}
        agentDisabled={chat.loadingHistory || chat.connection === "streaming"}
        disabled={!chat.threadReady || chat.loadingHistory}
        streaming={chat.connection === "streaming"}
        uploading={chat.uploading}
        onUploadFiles={(files) => void chat.uploadFiles(files)}
        onSend={chat.sendMessage}
        onQueue={chat.queueMessage}
        onStop={chat.stopStream}
        onLayoutChange={
          chat.expanded ? undefined : () => chat.fitCompactWindow()
        }
      />
      <p className="chat-footnote">内容由 AI 生成，仅供参考</p>
      <ChatResizeChrome />
      {chat.ttsNotice ? (
        <div className="chat-toast" role="status">
          {chat.ttsNotice}
        </div>
      ) : null}
    </main>
  );
}
