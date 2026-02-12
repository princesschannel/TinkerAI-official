import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Wand, UserCircle, Home, MessageSquare,
  Image as ImageIcon, LayoutGrid, UserRoundPen,
  ChevronDown, Paperclip, Mic, SendHorizontal, X, ArrowRight, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '../lib/gemini';

// --- LANDING PAGE COMPONENT (The design from your image) ---
const LandingPage = ({ onStart }) => {
  const companions = [
    { name: 'Silvermist', desc: 'Gentle support for your heart and emotions.' },
    { name: 'Periwinkle', desc: 'Knowledgeable guide for all your school subjects.' },
    { name: 'Gliss', desc: 'Energetic motivation to reach your daily goals.' }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#4e7c94] flex flex-col items-center justify-center px-6 py-12">
      {/* Magic Wave Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-30 bg-[radial-gradient(circle_at_center,_#9fbcc8_0%,_transparent_70%)] animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-[2px] border-white/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center">
        {/* Logo */}
        <div className="absolute top-[-10vh] left-0 flex items-center gap-2 text-white/90">
          <Wand className="w-5 h-5 -rotate-12" />
          <span className="text-lg font-bold">TinkerAI</span>
        </div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-md">
            Magic is just a <br />
            <span className="text-[#c7e3f1]">Conversation</span> away.
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Personalized guidance, emotional support, and creative brainstorming with the residents of Pixie Hollow. Choose your companion and start your journey today.
          </p>

          <button 
            onClick={() => onStart('Periwinkle')}
            className="group flex items-center gap-3 bg-[#9fbcc8] hover:bg-white text-[#2c5364] px-10 py-4 rounded-lg font-bold text-xl transition-all shadow-xl hover:scale-105 active:scale-95 mx-auto mb-24"
          >
            Start Chatting
            <div className="bg-white group-hover:bg-[#9fbcc8] rounded-full p-1 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </motion.div>

        {/* Character Selection Grid */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-white mb-8">Choose Your Companion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companions.map((char, i) => (
              <motion.div
                key={char.name}
                whileHover={{ y: -10 }}
                onClick={() => onStart(char.name)}
                className="bg-[#6b95a8]/40 backdrop-blur-md border border-white/20 p-8 rounded-xl text-left cursor-pointer hover:bg-white/20 transition-all flex flex-col justify-between h-48 shadow-lg"
              >
                <Star className="text-white w-6 h-6 mb-4 fill-white" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{char.name}</h3>
                  <p className="text-white/70 text-sm font-medium leading-snug">
                    {char.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
};

// --- THE MAIN COMPONENT (Sidebar.jsx) ---
export default function Sidebar() {
  const [view, setView] = useState('landing'); // 'landing' or 'chat'
  const [initialCharacter, setInitialCharacter] = useState('Periwinkle');

  const startChatAction = (char) => {
    setInitialCharacter(char);
    setView('chat');
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div key="landing" exit={{ opacity: 0 }}>
          <LandingPage onStart={startChatAction} />
        </motion.div>
      ) : (
        <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <TinkerApp initialChar={initialCharacter} onHome={() => setView('landing')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- YOUR ORIGINAL CHATBOT CODE (Functions Unchanged) ---
const TinkerApp = ({ initialChar, onHome }) => {
  const characterGreetings = {
    'Periwinkle': "What subject can I help you with today?",
    'Silvermist': "Do you want to talk about something on your heart?",
    'Gliss': "What goal would you like to work on today?"
  };

  const characterThemes = {
    'Periwinkle': { glow: 'shadow-[0_0_40px_rgba(135,206,250,0.3)]', border: 'border-[#87CEFA]/30', accent: 'text-[#87CEFA]', msgBg: 'bg-[#87CEFA]/10' },
    'Silvermist': { glow: 'shadow-[0_0_40px_rgba(173,216,230,0.3)]', border: 'border-[#ADD8E6]/30', accent: 'text-[#ADD8E6]', msgBg: 'bg-[#ADD8E6]/10' },
    'Gliss': { glow: 'shadow-[0_0_40px_rgba(175,238,238,0.3)]', border: 'border-[#AFEEEE]/30', accent: 'text-[#AFEEEE]', msgBg: 'bg-[#AFEEEE]/10' }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(initialChar);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentTheme = characterThemes[activeCharacter];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      title: 'Hi, Princess Channel!',
      text: `I'm ${activeCharacter}. ${characterGreetings[activeCharacter]}`,
    }
  ]);

  // Original functions preserved
  const handleSwitchCharacter = (name) => {
    setActiveCharacter(name);
    setMessages([{ id: Date.now(), sender: 'bot', title: 'Hi, Princess Channel!', text: `I'm ${name}. ${characterGreetings[name]}` }]);
    setIsSidebarOpen(false);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    const userMessage = { id: Date.now(), sender: 'user', text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await sendMessage(activeCharacter, updatedMessages);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: '✨ Pixie dust error! Try again.' }]);
    } finally { setIsLoading(false); }
  };

  // Helper Components from your code
  const NavItem = ({ icon, label, onClick }) => (
    <div onClick={onClick} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#0c536b] cursor-pointer transition-all group">
      <span className="font-semibold text-sm">{label}</span>
      <span className="text-white">{icon}</span>
    </div>
  );

  const SubNavItem = ({ label, color, onClick, isActive }) => (
    <div onClick={onClick} className={`${color} rounded-lg p-3 cursor-pointer transition-all border-2 ${isActive ? 'border-white/60 scale-105' : 'border-transparent'}`}>
      <span className="font-bold text-sm text-white">{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a4559] font-sans text-white">
      {/* Sidebar Section */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-full bg-[#0a4559] p-5 border-r border-white/5`}>
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
                <Wand className="w-6 h-6 -rotate-12" />
                <h1 className="text-xl font-bold">TinkerAI</h1>
            </div>
            <X className="lg:hidden cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
        </div>

        <nav className="space-y-1 mb-6">
          <NavItem icon={<Home size={20} />} label="Home" onClick={onHome} />
          <NavItem icon={<MessageSquare size={20} />} label="New Chat" />
        </nav>

        <div className="space-y-2 mb-6">
          <div className="bg-[#7899a7] rounded-lg p-3 font-bold text-sm text-[#0a4559]">Characters</div>
          <SubNavItem label="Silvermist" color="bg-[#406d80]" isActive={activeCharacter === 'Silvermist'} onClick={() => handleSwitchCharacter('Silvermist')} />
          <SubNavItem label="Periwinkle" color="bg-[#406d80]" isActive={activeCharacter === 'Periwinkle'} onClick={() => handleSwitchCharacter('Periwinkle')} />
          <SubNavItem label="Gliss" color="bg-[#406d80]" isActive={activeCharacter === 'Gliss'} onClick={() => handleSwitchCharacter('Gliss')} />
        </div>
      </aside>

      {/* Chat Content (Background matching the app theme) */}
      <main className="flex-1 relative flex items-center justify-center p-4 bg-[#4e7c94]">
        <div className={`relative w-full max-w-5xl h-[90vh] bg-[#0a4559]/60 backdrop-blur-2xl rounded-[40px] border flex flex-col p-6 lg:p-10 ${currentTheme.glow} ${currentTheme.border}`}>
          <div className="flex items-center gap-3 mb-8">
            <Menu className="lg:hidden cursor-pointer" onClick={() => setIsSidebarOpen(true)} />
            <h2 className={`font-bold text-lg ${currentTheme.accent}`}>TinkerAI › {activeCharacter}</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-5 rounded-2xl shadow-lg border ${msg.sender === 'user' ? 'bg-[#0a4559]' : `${currentTheme.msgBg} ${currentTheme.border}`}`}>
                  {msg.title && <h3 className={`font-bold mb-1 ${currentTheme.accent}`}>{msg.title}</h3>}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-8 flex justify-center">
            <div className={`w-full max-w-2xl bg-[#0a4559] border rounded-full flex items-center px-6 py-4 ${currentTheme.border}`}>
              <input 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Chat with ${activeCharacter}...`}
                className="bg-transparent flex-1 outline-none text-white text-sm"
              />
              <button onClick={handleSend} className="bg-[#e8dcc4] p-2 rounded-full ml-4 hover:scale-110 transition-transform">
                <SendHorizontal className="text-[#0a4559] w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};