package com.octop.pet

import android.os.Bundle
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : TauriActivity() {
  private var webView: WebView? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
  }

  override fun onWebViewCreate(webView: WebView) {
    this.webView = webView
    // Native TTS bridge -> window.NativeTTS
    webView.addJavascriptInterface(TtsBridge(webView), "NativeTTS")

    ViewCompat.setOnApplyWindowInsetsListener(webView) { _, insets ->
      publishInsets(webView, insets)
      // Do not consume; keep the rest of the tree's normal behavior.
      insets
    }

    // Re-publish a few times after first load so the SPA picks up the real
    // insets even if the first callback ran before layout completed.
    listOf(300L, 900L, 1800L, 3500L).forEach { delay ->
      webView.postDelayed(
        {
          ViewCompat.requestApplyInsets(webView)
          val insets = ViewCompat.getRootWindowInsets(window.decorView)
          if (insets != null) publishInsets(webView, insets)
        },
        delay,
      )
    }
  }

  private fun publishInsets(webView: WebView, insets: WindowInsetsCompat) {
    val density = resources.displayMetrics.density
    val top = insets.getInsets(WindowInsetsCompat.Type.statusBars()).top
    val navBottom = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom
    val imeBottom = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
    // When the keyboard is open it replaces the navigation bar at the bottom.
    val bottom = maxOf(navBottom, imeBottom)
    val t = top / density
    val b = bottom / density
    val k = imeBottom / density
    // Self-defining on every publish: works without a document-start script
    // and survives the document being recreated.
    val js = """
      window.__applyInsets = function (t, b, k) {
        var s = document.documentElement.style;
        s.setProperty('--safe-top', t + 'px');
        s.setProperty('--safe-bottom', b + 'px');
        s.setProperty('--keyboard-height', k + 'px');
      };
      window.__applyInsets($t, $b, $k);
    """.trimIndent()
    webView.evaluateJavascript(js, null)
  }
}
