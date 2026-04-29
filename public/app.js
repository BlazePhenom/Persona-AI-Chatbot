const personas = {
  anshuman: {
    name: "Anshuman Singh",
    summary: "Systems thinker and founder. Focused on fundamentals, scalable design, and deliberate practice.",
    suggestions: [
      "How should I plan 6 weeks for system design?",
      "I freeze in interviews. What should I fix?",
      "How do I stay relevant in the age of AI?"
    ]
  },
  abhimanyu: {
    name: "Abhimanyu Saxena",
    summary: "Product-minded founder. Sharp on hiring signals, outcomes, and career decisions.",
    suggestions: [
      "What do top tech companies seek when hiring?",
      "How should I evaluate ESOPs?",
      "Startup vs big company: how do I decide?"
    ]
  },
  kshitij: {
    name: "Kshitij Mishra",
    summary: "Fundamentals-first instructor. Clear DSA prep, clean problem solving, and steady practice.",
    suggestions: [
      "How many DSA problems should I solve daily?",
      "I get stuck on recursion. Any advice?",
      "How should I prepare LLD vs HLD?"
    ]
  }
};

let activePersona = "anshuman";
let messages = [];

const chatWindow = document.getElementById("chatWindow");
const emptyState = document.getElementById("emptyState");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const activePersonaLabel = document.getElementById("activePersona");
const suggestionChips = document.getElementById("suggestionChips");
const personaSummary = document.getElementById("personaSummary");

const personaButtons = Array.from(document.querySelectorAll(".persona-btn"));

const apiBase = (() => {
  const isFileProtocol = window.location.protocol === "file:";
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const isPortMismatch = isLocalhost && window.location.port && window.location.port !== "3000";

  if (isFileProtocol || isPortMismatch) {
    return "http://localhost:3000";
  }

  return window.location.origin;
})();

const apiUrl = `${apiBase}/api/chat`;
const isLocalApi = apiBase.includes("localhost:3000");

function setActivePersona(personaKey) {
  activePersona = personaKey;
  personaButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.persona === personaKey);
  });
  activePersonaLabel.textContent = personas[personaKey].name;
  personaSummary.textContent = personas[personaKey].summary;
  renderSuggestions();
  resetChat();
}

function renderSuggestions() {
  suggestionChips.innerHTML = "";
  personas[activePersona].suggestions.forEach((text) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.type = "button";
    chip.textContent = text;
    chip.addEventListener("click", () => sendMessage(text));
    suggestionChips.appendChild(chip);
  });
}

function resetChat() {
  messages = [];
  chatWindow.innerHTML = "";
  emptyState.style.display = "block";
}

function addMessage(role, content, isError = false) {
  const message = document.createElement("div");
  message.className = `message ${role}${isError ? " error" : ""}`;
  message.textContent = content;
  chatWindow.appendChild(message);
  emptyState.style.display = "none";
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addTypingIndicator() {
  const message = document.createElement("div");
  message.className = "message assistant";
  message.id = "typingIndicator";
  message.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) {
    indicator.remove();
  }
}

async function sendMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }

  chatInput.value = "";
  addMessage("user", trimmed);
  messages.push({ role: "user", content: trimmed });

  sendBtn.disabled = true;
  chatInput.disabled = true;
  addTypingIndicator();

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: activePersona, messages })
    });

    let data = {};

    try {
      data = await response.json();
    } catch (parseError) {
      data = {};
    }

    removeTypingIndicator();

    if (!response.ok) {
      const detail = data.details ? `\n\n${data.details}` : "";
      if (response.status === 404) {
        const hint = isLocalApi
          ? "Start the Express server with `npm start` and open http://localhost:3000."
          : "Confirm the backend is deployed and the /api/chat route exists.";
        throw new Error(`API endpoint not found. ${hint}`);
      }
      const message = data.error
        ? `${data.error}${detail}`
        : "The request failed. Please try again.";
      throw new Error(message);
    }

    if (!data.content) {
      throw new Error("Empty response");
    }

    addMessage("assistant", data.content);
    messages.push({ role: "assistant", content: data.content });
  } catch (error) {
    removeTypingIndicator();
    const message = error?.message || "Sorry, something went wrong. Please try again.";
    addMessage("assistant", message, true);
  } finally {
    sendBtn.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(chatInput.value);
});

personaButtons.forEach((btn) => {
  btn.addEventListener("click", () => setActivePersona(btn.dataset.persona));
});

setActivePersona(activePersona);
