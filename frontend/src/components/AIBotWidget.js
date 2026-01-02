import React, { useState, useRef, useEffect } from "react";

const BOT_NAME = "ShopBot";
const BOT_AVATAR = "🤖";

const exampleReplies = [
  "Hi! How can I help you today?",
  "You can ask me about products, orders, or anything else!",
  "I'm here to assist you with your shopping experience."
];

function getBotReply(userMsg) {
  // Placeholder: Replace with real AI API call
  if (/order|track/i.test(userMsg)) return "You can view your orders in the 'My Orders' section.";
  if (/refund|return/i.test(userMsg)) return "For refunds or returns, please visit your order details page.";
  if (/product|price|stock/i.test(userMsg)) return "Ask me about any product and I'll try to help!";
  return exampleReplies[Math.floor(Math.random() * exampleReplies.length)];
}

export default function AIBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm ShopBot. How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      const botReply = getBotReply(userMsg);
      setMessages((msgs) => [...msgs, { from: "bot", text: botReply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:scale-105 transition-all"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI Chatbot"
      >
        {BOT_AVATAR}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-xs bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <span className="font-bold text-lg flex items-center gap-2">{BOT_AVATAR} {BOT_NAME}</span>
            <button onClick={() => setOpen(false)} className="text-white text-xl font-bold">×</button>
          </div>
          <div className="flex-1 px-4 py-2 overflow-y-auto h-64 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`my-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${msg.from === "user" ? "bg-blue-500 text-white" : "bg-white/80 text-gray-900 border border-white/40"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex border-t border-white/20">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-900 placeholder-gray-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-xl hover:bg-blue-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
