"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/messages`, { cache: "no-store" });
        setMessages(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.message) return alert("Fill name and message");

    const res = await fetch(`${API}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) return alert("Failed to post");

    const newMsg = await res.json();
    setMessages((prev) => [newMsg, ...prev]);
    setForm({ name: "", message: "" });
  }

  return (
    <main className="container">
      <h1>ฝากข้อความ (Message Board)</h1>

      <form className="form-wrapper" onSubmit={submit}>
        <input
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button type="submit">Send</button>
      </form>

      <section>
        {loading ? (
          <div>Loading...</div>
        ) : messages.length === 0 ? (
          <div>No messages yet</div>
        ) : (
          messages.map((m) => (
            <article key={m.id} className="message-card">
              <div>
                <span className="message-name">{m.name}</span>
                <span className="message-date">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <div className="message-text">{m.message}</div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
