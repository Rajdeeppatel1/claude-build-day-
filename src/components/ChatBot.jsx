import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'remixicon/fonts/remixicon.css';
import './ChatBot.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hello! 👋 I'm AnnaSetu AI, your assistant for the Smart Food Waste Management Platform. I can help you with:\n\n• How to **donate food** or **register as an NGO**\n• Understanding our **platform features**\n• Learning about our **impact & mission**\n\nHow can I help you today?",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 100);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send only user/assistant messages (exclude the initial greeting for API)
      const apiMessages = updatedMessages
        .filter((_, i) => i > 0) // skip the initial bot greeting
        .map((m) => ({ role: m.role, content: m.content }));

      // If only one message (the user's first), just send that
      if (apiMessages.length === 0) {
        apiMessages.push({ role: 'user', content: trimmed });
      }

      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Sorry, I could not generate a response.' },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 🔄",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'How do I donate food?',
    'How to register as NGO?',
    'What is AnnaSetu?',
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <i className={isOpen ? 'ri-close-line' : 'ri-robot-2-line'}></i>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <div className="chatbot-avatar">
                  <i className="ri-robot-2-fill"></i>
                </div>
                <div>
                  <div className="chatbot-name">AnnaSetu AI</div>
                  <div className="chatbot-status">
                    <span className="chatbot-status-dot"></span>
                    Online
                  </div>
                </div>
              </div>
              <button
                className="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-subtract-line"></i>
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages" ref={messagesContainerRef} onScroll={handleMessagesScroll}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chatbot-msg ${msg.role === 'user' ? 'chatbot-msg-user' : 'chatbot-msg-bot'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="chatbot-msg-avatar">
                      <i className="ri-leaf-fill"></i>
                    </div>
                  )}
                  <div className="chatbot-msg-bubble">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(msg.content),
                      }}
                    />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="chatbot-msg chatbot-msg-bot">
                  <div className="chatbot-msg-avatar">
                    <i className="ri-leaf-fill"></i>
                  </div>
                  <div className="chatbot-msg-bubble chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              {/* Quick Questions (only show at start) */}
              {messages.length === 1 && (
                <div className="chatbot-quick-questions">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="chatbot-quick-btn"
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => {
                          setInput(q);
                          const userMsg = { role: 'user', content: q };
                          const updatedMessages = [...messages, userMsg];
                          setMessages(updatedMessages);
                          setInput('');
                          setIsLoading(true);

                          fetch('http://localhost:3001/api/chat', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              messages: [{ role: 'user', content: q }],
                            }),
                          })
                            .then((r) => r.json())
                            .then((data) => {
                              setMessages((prev) => [
                                ...prev,
                                {
                                  role: 'assistant',
                                  content: data.reply || 'Sorry, I could not generate a response.',
                                },
                              ]);
                            })
                            .catch(() => {
                              setMessages((prev) => [
                                ...prev,
                                {
                                  role: 'assistant',
                                  content:
                                    "I'm having trouble connecting. Please try again. 🔄",
                                },
                              ]);
                            })
                            .finally(() => setIsLoading(false));
                        }, 0);
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {showScrollBtn && (
              <button
                className="chatbot-scroll-btn"
                onClick={scrollToBottom}
              >
                <i className="ri-arrow-down-line"></i>
              </button>
            )}

            {/* Input */}
            <div className="chatbot-input-area">
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                placeholder="Ask me anything about AnnaSetu..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className="chatbot-send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
              >
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function formatMessage(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/• /g, '&bull; ');
}
