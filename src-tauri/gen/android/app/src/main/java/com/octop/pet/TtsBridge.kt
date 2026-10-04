package com.octop.pet

import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.webkit.JavascriptInterface
import android.webkit.WebView
import java.util.Locale

/**
 * Direct WebView JS bridge for text-to-speech. Registered as `window.NativeTTS`
 * via WebView.addJavascriptInterface, so it bypasses the Tauri plugin/ACL
 * layer entirely. Results are pushed back through window.__ttsCallback.
 */
class TtsBridge(private val webView: WebView) {
  private var tts: TextToSpeech? = null

  @Volatile
  private var ready = false
  private var seq = 0
  private val utteranceToCallback = HashMap<String, String>()

  init {
    webView.post {
      val t = TextToSpeech(webView.context) { status ->
        ready = status == TextToSpeech.SUCCESS
      }
      t.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
        override fun onStart(utteranceId: String?) {}

        override fun onDone(utteranceId: String?) {
          finish(utteranceId, "end")
        }

        @Deprecated("Deprecated in Java")
        override fun onError(utteranceId: String?) {
          finish(utteranceId, "error")
        }

        override fun onError(utteranceId: String?, errorCode: Int) {
          finish(utteranceId, "error")
        }
      })
      tts = t
    }
  }

  private fun finish(utteranceId: String?, type: String) {
    if (utteranceId == null) return
    val callbackId = synchronized(utteranceToCallback) {
      utteranceToCallback.remove(utteranceId)
    } ?: return
    webView.post {
      webView.evaluateJavascript(
        "window.__ttsCallback&&window.__ttsCallback('$type','$callbackId');",
        null,
      )
    }
  }

  @JavascriptInterface
  fun isReady(): Boolean = ready

  @JavascriptInterface
  fun speak(text: String, callbackId: String): String {
    if (!ready) return "no_engine"
    if (text.isBlank()) return "empty"
    webView.post {
      val t = tts ?: return@post
      t.stop()
      val ids = synchronized(utteranceToCallback) {
        val previous = utteranceToCallback.values.toList()
        utteranceToCallback.clear()
        previous
      }
      ids.forEach { id ->
        webView.evaluateJavascript(
          "window.__ttsCallback&&window.__ttsCallback('end','$id');",
          null,
        )
      }
      val utteranceId = "u${++seq}"
      synchronized(utteranceToCallback) {
        utteranceToCallback[utteranceId] = callbackId
      }
      val lang =
        if (text.any { ch -> ch.code in 0x4E00..0x9FFF }) Locale.SIMPLIFIED_CHINESE
        else Locale.US
      t.setLanguage(lang)
      val result = t.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
      if (result == TextToSpeech.ERROR) {
        synchronized(utteranceToCallback) {
          utteranceToCallback.remove(utteranceId)
        }
        webView.evaluateJavascript(
          "window.__ttsCallback&&window.__ttsCallback('error','$callbackId');",
          null,
        )
      }
    }
    return "started"
  }

  @JavascriptInterface
  fun stop() {
    webView.post {
      val ids = synchronized(utteranceToCallback) {
        val current = utteranceToCallback.values.toList()
        utteranceToCallback.clear()
        current
      }
      ids.forEach { id ->
        webView.evaluateJavascript(
          "window.__ttsCallback&&window.__ttsCallback('end','$id');",
          null,
        )
      }
      tts?.stop()
    }
  }
}
