import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8001/api/chat";

function nowHM() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

const starter = () => ([
  { role: "bot", text: "Hello! How can i help you?", ts: nowHM() },
]);

export default function App() {
  const [chats, setChats] = useState(() => {
    const firstId = makeId();
    return [
      { id: firstId, title: "New chat", messages: starter() },
    ];
  });
  const [activeId, setActiveId] = useState(() => chats[0].id);


  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const listRef = useRef(null);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeId),
    [chats, activeId]
  );

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [activeChat?.messages, loading]);

  function newChat() {
    const id = makeId();
    const chat = { id, title: "New chat", messages: starter() };
    setChats((prev) => [chat, ...prev]);
    setActiveId(id);
    setSidebarOpen(false);
    setError("");
    setMessage("");
  }

  function setTitleFromFirstUserMsg(chatId, text) {
    const t = text.trim().slice(0, 28);
    setChats((prev) =>
      prev.map((c) => (c.id === chatId && c.title === "New chat" ? { ...c, title: t || "Chat" } : c))
    );
  }

  async function sendMessage(e) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading || !activeChat) return;

    setError("");

    const userMsg = { role: "user", text: trimmed, ts: nowHM() };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c
      )
    );

    
    const wasFirstUser =
      activeChat.messages.filter((m) => m.role === "user").length === 0;
    if (wasFirstUser) setTitleFromFirstUserMsg(activeId, trimmed);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const botMsg = {
        role: "bot",
        text: data.reply ?? "No answer.",
        ts: nowHM(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, botMsg] } : c
        )
      );
    } catch {
      setError("Connection error. Please try again.");
      const botMsg = { role: "bot", text: "Connection error.", ts: nowHM() };
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, botMsg] } : c
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <div
        className={`overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sideTop">
          <div className="brand">
            <div>
              <div className="brandTitle">Verba AI</div>
            </div>
          </div>

          <button className="newBtn" onClick={newChat}>
            + New chat
          </button>
           <div className="brandSub">Your chats</div>
        </div>

        <div className="history">
          {chats.map((c) => (
            <button
              key={c.id}
              className={`histItem ${c.id === activeId ? "active" : ""}`}
              onClick={() => {
                setActiveId(c.id);
                setSidebarOpen(false);
                setError("");
              }}
              title={c.title}
            >
              <span className="dot" />
              <span className="histText">{c.title}</span>
            </button>
          ))}
        </div>
      </aside>

      
      <main className="main">
        <header className="topbar">
          <button className="menuBtn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="topTitle">
            {activeChat?.title || "Chat"}
          </div>
        </header>

        <section className="chatArea">
          <div className="messages" ref={listRef}>
            {activeChat?.messages.map((m, idx) => (
              <div key={idx} className={`row ${m.role}`}>
                <div className="bubble">
                  <div className="text">{m.text}</div>
                  <div className="meta">{m.ts}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="row bot">
                <div className="bubble">
                  <div className="typing">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="meta">typing…</div>
                </div>
              </div>
            )}
          </div>

          {error && <div className="error">{error}</div>}

          <form className="composer" onSubmit={sendMessage}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything"
            />
            <button type="submit" disabled={loading || !message.trim()}>
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
