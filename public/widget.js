(function () {
  "use strict";

  // Prevent multiple injections
  if (window.__ANAYA_WIDGET_INITIALIZED__) return;
  window.__ANAYA_WIDGET_INITIALIZED__ = true;

  // Read config from script tag
  const scriptTag = document.currentScript || document.querySelector("script[data-agent-id]") || document.querySelector("script[src*='widget.js']");
  const agentId = scriptTag?.getAttribute("data-agent-id") || "anaya_agent";
  const rawColor = scriptTag?.getAttribute("data-color");
  // Ensure original emerald green (#0ca656) by default
  let brandColor = (rawColor && rawColor !== "null" && rawColor !== "undefined") ? rawColor : "#0ca656";
  let agentName = scriptTag?.getAttribute("data-name") || "Anaya";
  const apiBase = scriptTag?.getAttribute("data-api-base") || ((typeof window !== "undefined" && window.location.origin.includes("localhost")) ? "http://localhost:3000" : "https://anaya-six.vercel.app");
  const targetDomain = scriptTag?.getAttribute("data-domain") || (typeof window !== "undefined" ? window.location.hostname : "anavyainfotech.com");
  let domainId = null;

  // SVG String of Anaya radiating spark icon
  function getAnayaIcon(color = "#ffffff", size = 26) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="${color}" style="display:block;margin:auto;">
        <ellipse cx="50" cy="18" rx="6" ry="14" />
        <ellipse cx="50" cy="82" rx="6" ry="14" />
        <ellipse cx="18" cy="50" rx="14" ry="6" />
        <ellipse cx="82" cy="50" rx="14" ry="6" />
        <ellipse cx="27" cy="27" rx="6" ry="12" transform="rotate(-45 27 27)" />
        <ellipse cx="73" cy="27" rx="6" ry="12" transform="rotate(45 73 27)" />
        <ellipse cx="27" cy="73" rx="6" ry="12" transform="rotate(45 27 73)" />
        <ellipse cx="73" cy="73" rx="6" ry="12" transform="rotate(-45 73 73)" />
        <circle cx="50" cy="50" r="11" />
      </svg>
    `;
  }

  // Close cross icon
  function getCloseIcon(color = "#ffffff") {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:auto;">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
  }

  // Create Root Widget Container
  const container = document.createElement("div");
  container.id = "anaya-sales-widget-root";
  container.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;";
  document.body.appendChild(container);

  // Widget Row (holds Trigger Button + Callout Pill)
  const widgetRow = document.createElement("div");
  widgetRow.id = "anaya-widget-row";
  widgetRow.style.cssText = "display:flex;align-items:center;gap:12px;position:relative;";
  container.appendChild(widgetRow);

  // Rounded Pill Badge on the Left ("Chat with us !") - Exactly same 58px height as widget button
  const pillBadge = document.createElement("div");
  pillBadge.id = "anaya-widget-pill";
  pillBadge.innerHTML = `
    <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background-color:#0ca656;box-shadow:0 0 8px #0ca656;flex-shrink:0;"></span>
    <span style="font-weight:600;letter-spacing:-0.01em;">Chat with us !</span>
  `;
  pillBadge.style.cssText = `
    height: 58px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    color: #18181b;
    padding: 0 22px;
    border-radius: 9999px;
    font-size: 14px;
    white-space: nowrap;
    box-shadow: 0 8px 24px -4px rgba(0,0,0,0.14), 0 2px 6px -1px rgba(0,0,0,0.06);
    border: 1px solid rgba(228, 228, 231, 0.9);
    cursor: pointer;
    user-select: none;
    opacity: 0;
    transform: translateX(18px) scale(0.95);
    transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
  `;
  widgetRow.appendChild(pillBadge);

  // Floating Trigger Button (The Anaya Icon Bubble)
  const triggerBtn = document.createElement("button");
  triggerBtn.id = "anaya-widget-trigger";
  triggerBtn.setAttribute("aria-label", "Chat with AI Sales Assistant");
  triggerBtn.style.cssText = `
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background-color: ${brandColor};
    border: none;
    box-shadow: 0 8px 24px -4px rgba(0,0,0,0.2), 0 2px 6px -1px rgba(0,0,0,0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
    position: relative;
    flex-shrink: 0;
  `;
  triggerBtn.innerHTML = getAnayaIcon("#ffffff", 30);
  widgetRow.appendChild(triggerBtn);

  // Pill entrance and auto-hide sliding into the widget
  let isPillDismissed = false;
  function hidePillBadge() {
    if (isPillDismissed) return;
    isPillDismissed = true;
    pillBadge.style.opacity = "0";
    pillBadge.style.pointerEvents = "none";
    // Slide right behind/into the trigger button
    pillBadge.style.transform = "translateX(42px) scale(0.85)";
    setTimeout(() => {
      pillBadge.style.display = "none";
    }, 600);
  }

  // Slide pill in smoothly shortly after page load
  setTimeout(() => {
    if (!isOpen && !isPillDismissed) {
      pillBadge.style.opacity = "1";
      pillBadge.style.transform = "translateX(0) scale(1)";
    }
  }, 400);

  // Auto slide into widget after 4.5 seconds
  const autoHideTimer = setTimeout(() => {
    hidePillBadge();
  }, 4500);

  // Clicking pill opens the chat
  pillBadge.addEventListener("click", () => {
    clearTimeout(autoHideTimer);
    hidePillBadge();
    if (!isOpen) toggleWidget();
  });

  // Chat Window Panel (Modern Rounded Floating Capsule)
  const chatWindow = document.createElement("div");
  chatWindow.id = "anaya-widget-window";
  chatWindow.style.cssText = `
    position: absolute;
    bottom: 0;
    right: 0;
    width: 390px;
    height: 640px;
    max-height: calc(100vh - 48px);
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: none;
    border-radius: 36px;
    box-shadow: 0 24px 60px -12px rgba(0,0,0,0.18), 0 0 1px 1px rgba(0,0,0,0.03);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px) scale(0.96);
    transform-origin: bottom right;
    transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  container.appendChild(chatWindow);

  // Window Header with Frosted Glass Blur, No Borders, Clean Brand Icon
  const header = document.createElement("div");
  header.style.cssText = `
    padding: 18px 20px 14px;
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  `;
  header.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:transparent;">
        ${getAnayaIcon(brandColor, 28)}
      </div>
      <div>
        <div style="font-size:14px;font-weight:600;color:#18181b;letter-spacing:-0.01em;">${agentName}</div>
        <div style="font-size:11px;color:#0ca656;font-weight:500;display:flex;align-items:center;gap:4px;">
          <span style="width:6px;height:6px;border-radius:50%;background:#0ca656;display:inline-block;"></span> Online &bull; Instant Store Help
        </div>
      </div>
    </div>
    <button id="anaya-window-close" style="width:30px;height:30px;border-radius:50%;background:rgba(244,244,245,0.8);border:none;cursor:pointer;padding:0;color:#71717a;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
  chatWindow.appendChild(header);

  // Chat Messages Feed
  const messagesList = document.createElement("div");
  messagesList.id = "anaya-widget-messages";
  messagesList.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;
  chatWindow.appendChild(messagesList);

  // Inject CSS Keyframes for Pulsing 3-Dot Animation
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes anayaDotPulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1.1); opacity: 1; }
    }
    .anaya-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${brandColor};
      display: inline-block;
      animation: anayaDotPulse 1.4s infinite ease-in-out both;
    }
    .anaya-dot:nth-child(1) { animation-delay: -0.32s; }
    .anaya-dot:nth-child(2) { animation-delay: -0.16s; }
  `;
  document.head.appendChild(styleTag);

  // Chat Conversation State (Maintains full history across turns)
  const conversationHistory = [
    { role: "assistant", content: `Hi there! I am ${agentName}. How can I help you today?` }
  ];

  // Initial Welcome Message with Left Icon for Assistant
  function addMessage(role, text) {
    const isUser = role === "user";
    const row = document.createElement("div");
    row.style.cssText = `
      display: flex;
      align-items: flex-end;
      gap: 8px;
      align-self: ${isUser ? "flex-end" : "flex-start"};
      max-width: 86%;
    `;

    // Left Icon for Assistant (NO background, pure brand icon)
    if (!isUser) {
      const iconWrap = document.createElement("div");
      iconWrap.style.cssText = "width:24px;height:24px;flex-shrink:0;margin-bottom:4px;display:flex;align-items:center;justify-content:center;background:transparent;";
      iconWrap.innerHTML = getAnayaIcon(brandColor, 22);
      row.appendChild(iconWrap);
    }

    const bubble = document.createElement("div");
    bubble.style.cssText = `
      background: ${isUser ? "#18181b" : "rgba(244, 244, 245, 0.95)"};
      color: ${isUser ? "#ffffff" : "#18181b"};
      padding: 12px 18px;
      border-radius: 24px;
      font-size: 13px;
      line-height: 1.45;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      word-break: break-word;
    `;
    bubble.textContent = text;
    row.appendChild(bubble);

    messagesList.appendChild(row);
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  addMessage("assistant", conversationHistory[0].content);

  // Chat Input Box (Rounded-full Input Bar, Mic Voice-to-Text Button, Rounded-full Send Button)
  const inputContainer = document.createElement("form");
  inputContainer.style.cssText = `
    padding: 14px 18px 18px;
    background: transparent;
    border-top: none;
    display: flex;
    gap: 8px;
    align-items: center;
  `;
  inputContainer.innerHTML = `
    <div style="flex:1;position:relative;display:flex;align-items:center;">
      <input 
        id="anaya-chat-input"
        type="text" 
        placeholder="Type or click mic to talk..." 
        style="width:100%;border:none;border-radius:9999px;padding:12px 42px 12px 18px;font-size:13px;outline:none;background:rgba(244, 244, 245, 0.95);color:#18181b;box-shadow:inset 0 1px 2px rgba(0,0,0,0.03);"
      />
      <button
        id="anaya-mic-btn"
        type="button"
        title="Voice to text (bol kar likhein)"
        style="position:absolute;right:8px;width:30px;height:30px;border-radius:50%;background:transparent;border:none;color:#71717a;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;"
      >
        <svg id="anaya-mic-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="22"></line>
        </svg>
      </button>
    </div>
    <button 
      type="submit" 
      style="width:42px;height:42px;border-radius:9999px;background:#18181b;border:none;color:#ffffff;display:flex;align-items:center;justify-content:center;cursor:pointer;shrink:0;transition:transform 0.2s;"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  `;
  chatWindow.appendChild(inputContainer);

  // Speech Recognition (Web Speech API for Speech-to-Text)
  const micBtn = document.getElementById("anaya-mic-btn");
  const chatInput = document.getElementById("anaya-chat-input");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition && micBtn && chatInput) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "hi-IN"; // Supports Hindi & English auto

    let isListening = false;

    micBtn.addEventListener("click", () => {
      if (!isListening) {
        try {
          recognition.start();
        } catch (_) {}
      } else {
        recognition.stop();
      }
    });

    recognition.onstart = () => {
      isListening = true;
      micBtn.style.color = "#ffffff";
      micBtn.style.background = "#0ca656";
      micBtn.style.boxShadow = "0 0 10px rgba(12, 166, 86, 0.5)";
      chatInput.placeholder = "Listening...";
    };

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      chatInput.value = currentTranscript;
    };

    recognition.onerror = () => {
      isListening = false;
      micBtn.style.color = "#71717a";
      micBtn.style.background = "transparent";
      micBtn.style.boxShadow = "none";
      chatInput.placeholder = "Type or click mic to talk...";
    };

    recognition.onend = () => {
      isListening = false;
      micBtn.style.color = "#71717a";
      micBtn.style.background = "transparent";
      micBtn.style.boxShadow = "none";
      chatInput.placeholder = "Type or click mic to talk...";
      chatInput.focus();
    };
  } else if (micBtn) {
    micBtn.style.display = "none";
  }

  // Toggle Window State
  let isOpen = false;
  function toggleWidget() {
    isOpen = !isOpen;
    if (isOpen) {
      // Dismiss pill if opened
      hidePillBadge();

      // 1. Hide the bottom floating bubble completely
      triggerBtn.style.opacity = "0";
      triggerBtn.style.pointerEvents = "none";
      triggerBtn.style.transform = "scale(0.8)";

      // 2. Open chat window smoothly from the exact same position
      chatWindow.style.opacity = "1";
      chatWindow.style.pointerEvents = "auto";
      chatWindow.style.transform = "translateY(0) scale(1)";
      setTimeout(() => document.getElementById("anaya-chat-input")?.focus(), 150);
    } else {
      // 1. Close chat window
      chatWindow.style.opacity = "0";
      chatWindow.style.pointerEvents = "none";
      chatWindow.style.transform = "translateY(20px) scale(0.96)";

      // 2. Show the bottom floating bubble back in place
      triggerBtn.style.opacity = "1";
      triggerBtn.style.pointerEvents = "auto";
      triggerBtn.style.transform = "scale(1)";
    }
  }

  triggerBtn.addEventListener("click", toggleWidget);
  document.getElementById("anaya-window-close")?.addEventListener("click", toggleWidget);

  // Hover animations on trigger
  triggerBtn.addEventListener("mouseenter", () => {
    if (!isOpen) {
      triggerBtn.style.transform = "scale(1.08)";
    } else {
      triggerBtn.style.transform = "scale(1.1)";
    }
  });
  triggerBtn.addEventListener("mouseleave", () => {
    triggerBtn.style.transform = "scale(1)";
  });

  // Handle User Message Submission
  async function handleUserSubmit(query) {
    if (!query) return;
    console.log("[Anaya Widget] Submitting message:", query, "to", apiBase + "/api/chat");

    const input = document.getElementById("anaya-chat-input");
    if (input) input.value = "";
    addMessage("user", query);
    conversationHistory.push({ role: "user", content: query });

    // 3-Dot Pulsing Typing Animation Container with Left Brand Icon
    const typingRow = document.createElement("div");
    typingRow.style.cssText = "display:flex;align-items:flex-end;gap:8px;align-self:flex-start;max-width:86%;";

    const typingIconWrap = document.createElement("div");
    typingIconWrap.style.cssText = "width:24px;height:24px;flex-shrink:0;margin-bottom:4px;display:flex;align-items:center;justify-content:center;background:transparent;";
    typingIconWrap.innerHTML = getAnayaIcon(brandColor, 22);
    typingRow.appendChild(typingIconWrap);

    const typingBubble = document.createElement("div");
    typingBubble.style.cssText = `
      background: rgba(244, 244, 245, 0.95);
      padding: 12px 18px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      gap: 5px;
      height: 18px;
    `;
    typingBubble.innerHTML = `
      <span class="anaya-dot"></span>
      <span class="anaya-dot"></span>
      <span class="anaya-dot"></span>
    `;
    typingRow.appendChild(typingBubble);
    messagesList.appendChild(typingRow);
    messagesList.scrollTop = messagesList.scrollHeight;

    // Persistent Session Token for this visitor
    let visitorSessionId = localStorage.getItem("anaya_visitor_session_id");
    if (!visitorSessionId) {
      visitorSessionId = "sess_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
      localStorage.setItem("anaya_visitor_session_id", visitorSessionId);
    }

    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          message: query,
          session_id: visitorSessionId,
          domain: targetDomain,
          domain_id: domainId || (agentId.startsWith("agent_") ? null : agentId),
          page_visited: window.location.href
        })
      });
      const data = await res.json();
      typingRow.remove();
      if (data.reply) {
        addMessage("assistant", data.reply);
        conversationHistory.push({ role: "assistant", content: data.reply });
      } else {
        addMessage("assistant", "I am having trouble answering right now. Please try again shortly.");
      }
    } catch (err) {
      typingBubble.remove();
      addMessage("assistant", "Could not connect to AI server. Please verify your connection.");
    }
  }

  // Handle Chat Submit
  inputContainer.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("anaya-chat-input");
    const query = input?.value.trim();
    if (!query) return;
    handleUserSubmit(query);
  });

  // Dynamic Live Sync: Fetch Saved Settings from Server for this Domain
  async function syncSavedSettings() {
    try {
      const res = await fetch(`${apiBase}/api/widget-config?domain=${encodeURIComponent(targetDomain)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.domain_id) domainId = data.domain_id;
      if (data.config) {
        const c = data.config;
        if (c.name) {
          agentName = c.name;
          const nameEl = document.querySelector("#anaya-widget-window div[style*='font-size:14px']");
          if (nameEl) nameEl.textContent = c.name;
        }
        if (c.color) {
          brandColor = c.color;
          triggerBtn.style.backgroundColor = c.color;
          const starburstHeader = document.querySelector("#anaya-widget-window div[style*='width:28px']");
          if (starburstHeader) starburstHeader.innerHTML = getAnayaIcon(c.color, 28);
          const onlineDot = document.querySelector("#anaya-widget-pill span[style*='border-radius:50%']");
          if (onlineDot) {
            onlineDot.style.backgroundColor = c.color;
            onlineDot.style.boxShadow = `0 0 8px ${c.color}`;
          }
        }
        if (c.pillButtonText) {
          const pillTextEl = pillBadge.querySelector("span:nth-child(2)");
          if (pillTextEl) pillTextEl.textContent = c.pillButtonText;
        }
        if (c.widgetPosition === "left") {
          container.style.right = "auto";
          container.style.left = "24px";
          chatWindow.style.right = "auto";
          chatWindow.style.left = "0";
          chatWindow.style.transformOrigin = "bottom left";
          widgetRow.style.flexDirection = "row-reverse";
        }
      }
    } catch (_) {}
  }

  // Trigger sync on load
  syncSavedSettings();

})();