import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Wand, UserCircle, Home, MessageSquare,
  Image as ImageIcon, LayoutGrid, UserRoundPen,
  ChevronDown, Paperclip, Mic, SendHorizontal, X,
  Sparkles, ArrowRight, ShieldCheck, Zap, Info
} from 'lucide-react';
import { sendMessage } from '../lib/gemini';

// --- HELPER COMPONENTS FOR YOUR ORIGINAL CHATBOT ---
const NavItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#0c536b] cursor-pointer transition-all group active:scale-95">
    <span className="font-semibold text-sm">{label}</span>
    <span className="text-white group-hover:opacity-100">{icon}</span>
  </div>
);

const SubNavItem = ({ label, color, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`${color} rounded-lg p-3 cursor-pointer hover:brightness-110 transition-all shadow-sm active:scale-95 border-2 ${isActive ? 'border-white/60 scale-105 shadow-lg' : 'border-transparent opacity-80'}`}
  >
    <span className="font-bold text-sm text-white">{label}</span>
  </div>
);

// --- NEW LANDING PAGE COMPONENT ---
const LandingPage = ({ onStartChat, onSelectCharacter }) => {
  const [showCharacterMenu, setShowCharacterMenu] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const characterData = [
    {
      name: 'Silvermist',
      personality: 'The sweet, easygoing water fairy. She is sympathetic, optimistic, and always ready to listen to your heart.',
      imageUrl: 'silvermist.png',
      zoomClass: 'scale-[2.2] translate-y-4'
    },
    {
      name: 'Periwinkle',
      personality: 'A bubbly and curious frost fairy. She loves discovering new things and brings a fun-loving, adventurous spirit.',
      imageUrl: 'periwinkle.png',
      zoomClass: 'scale-125'
    },
    {
      name: 'Gliss',
      personality: 'An enthusiastic and energetic frost fairy. She is bright, slightly obsessive about winter magic, and full of joy.',
      imageUrl: 'gliss.png',
      zoomClass: 'scale-[2.5] translate-y-6'
    }
  ];

  const InputField = ({ label, type = "text", placeholder }) => (
    <div className="flex flex-col gap-1 w-full text-left">
      <label className="text-xs font-bold text-white/60 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#e8dcc4] transition-colors text-sm w-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#0a4559] relative overflow-hidden flex flex-col font-sans text-white">
      {/* Background Decor with Drift effect */}
      <div
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center animate-drift"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a4559]/20 via-[#0a4559]/60 to-[#0a4559] z-0" />

      {/* Sparkle overlay effect */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-[#e8dcc4] rounded-full animate-ping [animation-delay:1s]" />
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white rounded-full animate-ping [animation-delay:2s]" />
      </div>

      {/* Login Modal Overlay */}
      {showLoginForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a4559]/80 backdrop-blur-md" onClick={() => setShowLoginForm(false)} />
          <div className="relative bg-[#0c536b] border border-white/10 w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-pop">
            <button
              onClick={() => setShowLoginForm(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center gap-6">
              <div className="bg-[#e8dcc4] p-3 rounded-2xl text-[#0a4559]">
                <Wand size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black">Welcome Back</h2>
                <p className="text-sm text-white/50">Enter your details to access the magic.</p>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-4">
                  <InputField label="First Name" placeholder="Jane" />
                  <InputField label="Last Name" placeholder="Doe" />
                </div>
                <InputField label="Email Address" type="email" placeholder="jane@example.com" />
                <InputField label="Password" type="password" placeholder="••••••••" />
              </div>

              <button
                onClick={onStartChat}
                className="w-full bg-[#e8dcc4] text-[#0a4559] py-4 rounded-2xl font-black hover:scale-[1.02] transition-transform shadow-lg shadow-[#e8dcc4]/10"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="relative z-50 flex justify-between items-center px-4 md:px-6 lg:px-12 py-6 md:py-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer z-[60]">
          <Wand className="w-6 h-6 md:w-8 md:h-8 -rotate-12 text-[#e8dcc4] group-hover:rotate-12 transition-transform duration-500" />
          <span className="text-xl md:text-2xl font-black tracking-tighter group-hover:text-[#e8dcc4] transition-colors">TinkerAI</span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-[60] text-white p-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 text-sm font-bold opacity-80 relative items-center">
          <button
            onClick={() => { setShowCharacterMenu(!showCharacterMenu); setShowAboutMenu(false); }}
            className="hover:text-[#e8dcc4] transition-colors flex items-center gap-1 z-[60] bg-white/5 px-4 py-2 rounded-full border border-white/10"
          >
            Characters <ChevronDown size={14} className={showCharacterMenu ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>

          {showCharacterMenu && (
            <>
              <div className="fixed inset-0 z-[55]" onClick={() => setShowCharacterMenu(false)} />
              <div className="absolute top-full left-1/2 -translate-x-1/2 lg:left-[-50px] lg:translate-x-0 mt-6 w-[90vw] md:w-[550px] bg-[#0a4559]/95 backdrop-blur-2xl border border-white/20 rounded-[40px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] z-[60] p-6 animate-pop">
                <div className="flex flex-col gap-4">
                  {characterData.map((char) => (
                    <div key={char.name} className="group flex items-center gap-6 p-5 rounded-3xl border border-white/5 bg-white/5 shadow-sm">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-[#0c536b] overflow-hidden flex-shrink-0 border-2 border-white/10 shadow-lg">
                        <img src={char.imageUrl} alt={char.name} className={`w-full h-full object-contain transition-transform duration-700 ${char.zoomClass}`} />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xl md:text-2xl text-[#e8dcc4]">{char.name}</span>
                          <Sparkles size={16} className="text-[#e8dcc4]" />
                        </div>
                        <p className="text-xs leading-relaxed text-white/60 font-bold line-clamp-2 md:line-clamp-none">{char.personality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <button className="hover:text-[#e8dcc4] transition-colors py-2">Safety</button>

          <div className="relative">
            <button
              onClick={() => { setShowAboutMenu(!showAboutMenu); setShowCharacterMenu(false); }}
              className={`hover:text-[#e8dcc4] transition-colors py-2 flex items-center gap-1 ${showAboutMenu ? 'text-[#e8dcc4]' : ''}`}
            >
              About <Info size={14} />
            </button>

            {showAboutMenu && (
              <>
                <div className="fixed inset-0 z-[55]" onClick={() => setShowAboutMenu(false)} />
                <div className="absolute top-full right-0 mt-6 w-[90vw] md:w-[480px] bg-[#0c536b]/95 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] z-[60] p-8 md:p-10 animate-pop">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-[#e8dcc4]">
                      <div className="bg-[#e8dcc4]/10 p-2 rounded-xl">
                        <Wand size={28} />
                      </div>
                      <h3 className="font-black text-2xl md:text-3xl tracking-tight">What is TinkerAI?</h3>
                    </div>

                    <p className="text-base md:text-lg leading-relaxed text-white/90 font-bold italic">
                      "TinkerAI is your magical AI companion, blending modern intelligence with the timeless wisdom of Pixie Hollow. Whether you need emotional support, creative inspiration, or academic help, our fairies are here to light your path."
                    </p>

                    <div className="h-px bg-white/10 w-full my-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-[#e8dcc4]" />
                        <p className="text-[10px] md:text-xs text-white/40 uppercase font-black tracking-widest">Powered by Gemini & Pixie Dust</p>
                      </div>
                      <Info size={16} className="text-white/20" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setShowLoginForm(true)}
            className="bg-[#e8dcc4] text-[#0a4559] px-8 py-2 rounded-full font-bold hover:bg-[#e8dcc4] hover:text-[#0a4559] transition-all"
          >
            Login
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-[#0a4559]/95 backdrop-blur-xl z-[50] flex flex-col pt-24 px-6 md:hidden animate-pop overflow-y-auto">
            <div className="flex flex-col gap-6 text-xl font-bold pb-10">
              {/* Mobile Character Menu Toggle */}
              <div className="flex flex-col gap-4 bg-white/5 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowCharacterMenu(!showCharacterMenu)}
                  className="flex items-center justify-between p-4 w-full"
                >
                  Characters <ChevronDown size={20} className={`transition-transform duration-300 ${showCharacterMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Character List - STATIC PROFILES */}
                {showCharacterMenu && (
                  <div className="flex flex-col bg-black/20 pb-2 animate-in slide-in-from-top-2 duration-300">
                    {characterData.map((char) => (
                      <div
                        key={char.name}
                        className="flex items-center gap-3 p-4 border-b border-white/5 last:border-0"
                      >
                        <img src={char.imageUrl} alt={char.name} className="w-12 h-12 object-contain" />
                        <div className="flex flex-col">
                          <span className="text-base text-[#e8dcc4] font-black">{char.name}</span>
                          <span className="text-[10px] text-white/70 font-normal leading-tight">{char.personality}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="p-4 bg-white/5 rounded-2xl text-left">Safety</button>

              <button
                onClick={() => { setShowAboutMenu(true); setShowMobileMenu(false); }}
                className="p-4 bg-white/5 rounded-2xl text-left"
              >
                About
              </button>

              <button
                onClick={() => { setShowLoginForm(true); setShowMobileMenu(false); }}
                className="bg-[#e8dcc4] text-[#0a4559] p-4 rounded-2xl font-black text-center mt-4"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {/* Mobile About Modal - Root Level to ensure visibility */}
        {showAboutMenu && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:hidden">
            <div className="absolute inset-0 bg-[#0a4559]/90 backdrop-blur-xl" onClick={() => setShowAboutMenu(false)} />
            <div className="relative bg-[#0c536b] border border-white/10 w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-pop overflow-y-auto max-h-[85vh]">
              <button
                onClick={() => setShowAboutMenu(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col gap-6 pt-2">
                <div className="flex items-center gap-3 text-[#e8dcc4]">
                  <div className="bg-[#e8dcc4]/10 p-2 rounded-xl">
                    <Wand size={24} />
                  </div>
                  <h3 className="font-black text-2xl tracking-tight">What is TinkerAI?</h3>
                </div>

                <p className="text-base leading-relaxed text-white/90 font-bold italic">
                  "TinkerAI is your magical AI companion, blending modern intelligence with the timeless wisdom of Pixie Hollow. Whether you need emotional support, creative inspiration, or academic help, our fairies are here to light your path."
                </p>

                <div className="h-px bg-white/10 w-full my-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#e8dcc4]" />
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Powered by Gemini</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto mt-[-5vh] animate-float">
        <div className="inline-flex items-center gap-2 bg-[#e8dcc4]/10 border border-[#e8dcc4]/20 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[#e8dcc4] text-[10px] md:text-xs font-black mb-8 md:mb-10 tracking-[0.2em]">
          <Sparkles size={14} className="animate-spin" />
          MAGIC MEETS INTELLIGENCE
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-[100px] font-black tracking-tighter leading-[0.9] mb-6 md:mb-10">
          Magic is just a <br />
          <span className="text-[#e8dcc4] animate-glow">Conversation away.</span>
        </h1>

        <p className="text-base md:text-lg lg:text-2xl font-bold opacity-70 max-w-3xl mb-10 md:mb-14 leading-relaxed tracking-tight px-4">
          TinkerAI brings the wisdom of Pixie Hollow to your fingertips. Chat with Silvermist,
          Periwinkle, or Gliss to navigate life's currents with grace and magic.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full justify-center mb-16 md:mb-24">
          <button
            onClick={onStartChat}
            className="group bg-[#e8dcc4] text-[#0a4559] px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-2xl font-black flex items-center justify-center gap-4 hover:scale-105 md:hover:scale-110 hover:shadow-[0_0_50px_rgba(232,220,196,0.5)] transition-all duration-500"
          >
            Start Chatting <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* RESTORED CHARACTER CARDS SECTION - Replaces Features Row */}
        <div className="w-full pb-10">
          <div className="flex items-center gap-4 mb-8 justify-center opacity-60">
            <div className="h-[1px] bg-white w-12 md:w-24"></div>
            <h2 className="text-sm md:text-lg font-black tracking-[0.2em] uppercase">Choose Your Companion</h2>
            <div className="h-[1px] bg-white w-12 md:w-24"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full px-2">
            {characterData.map((char) => (
              <div
                key={char.name}
                onClick={() => onSelectCharacter(char.name)}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[30px] md:rounded-[40px] text-left hover:bg-white/10 hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8dcc4]/20 blur-[60px] rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="h-40 flex items-center justify-center mb-6">
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className={`h-full w-auto object-contain drop-shadow-2xl transition-transform duration-700 ${char.zoomClass} group-hover:scale-[1.15]`}
                    />
                  </div>

                  <h3 className="text-2xl font-black mb-2 text-white group-hover:text-[#e8dcc4] transition-colors">{char.name}</h3>
                  <p className="text-sm opacity-60 font-bold leading-relaxed mb-6">{char.personality}</p>

                  <div className="flex items-center text-xs font-black tracking-widest text-[#e8dcc4] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    SAY HELLO <ArrowRight size={14} className="ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 md:py-10 text-center opacity-40 text-[10px] md:text-xs font-black tracking-[0.5em]">
        © 2026 TINKER AI • MADE WITH PIXIE DUST
      </footer>
    </div>
  );
};

// --- MAIN SIDEBAR COMPONENT (INCLUDES YOUR CHATBOT) ---
const Sidebar = () => {
  const [currentView, setCurrentView] = useState('landing');

  const characterGreetings = {
    'Periwinkle': "What subject can I help you with today?",
    'Silvermist': "Do you want to talk about something on your heart?",
    'Gliss': "What goal would you like to work on today?"
  };

  const characterThemes = {
    'Periwinkle': {
      glow: 'shadow-[0_0_40px_rgba(135,206,250,0.3)]',
      border: 'border-[#87CEFA]/30',
      accent: 'text-[#87CEFA]',
      msgBg: 'bg-[#87CEFA]/10'
    },
    'Silvermist': {
      glow: 'shadow-[0_0_40px_rgba(173,216,230,0.3)]',
      border: 'border-[#ADD8E6]/30',
      accent: 'text-[#ADD8E6]',
      msgBg: 'bg-[#ADD8E6]/10'
    },
    'Gliss': {
      glow: 'shadow-[0_0_40px_rgba(175,238,238,0.3)]',
      border: 'border-[#AFEEEE]/30',
      accent: 'text-[#AFEEEE]',
      msgBg: 'bg-[#AFEEEE]/10'
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState('Periwinkle');
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
      text: `I'm Periwinkle. ${characterGreetings['Periwinkle']}`,
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (currentView === 'chat') {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [activeCharacter, currentView]);

  const handleSwitchCharacter = (name) => {
    setActiveCharacter(name);
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        title: 'Hi, Princess Channel!',
        text: `I'm ${name}. ${characterGreetings[name]}`,
      }
    ]);
    setIsSidebarOpen(false);
    setCurrentView('chat');
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
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: reply },
      ]);
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: '✨ Oh no, my pixie dust ran out! Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatHistory = [
    { id: 1, title: "Moving on from heartbreak", date: "2 mins ago" },
    { id: 2, title: "Healthy morning routines", date: "1 hour ago" },
    { id: 3, title: "Gift ideas for friends", date: "Yesterday" },
  ];

  const colors = {
    bgMain: 'bg-[#0a4559]',
    bgItemActive: 'bg-[#0c536b]',
    bgCharacterHeader: 'bg-[#7899a7]',
    bgSubItemDark: 'bg-[#406d80]',
    textMain: 'text-white'
  };

  if (currentView === 'landing') {
    return (
      <LandingPage
        onStartChat={() => setCurrentView('chat')}
        onSelectCharacter={handleSwitchCharacter}
      />
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a4559] font-sans text-white animate-in fade-in duration-500">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col h-full ${colors.bgMain} p-5 border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <Wand className="w-6 h-6 -rotate-12 text-white" />
            <h1 className="text-xl font-bold tracking-tight text-white">TinkerAI</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1">
            <X className="w-6 h-6 text-white" />
          </button>
          <Menu className="hidden lg:block w-6 h-6 cursor-pointer text-white" />
        </div>

        <div className="flex items-center gap-3 mb-8 px-1">
          <UserCircle className="w-9 h-9 text-white" />
          <span className="font-semibold text-sm">Princess Channel B.</span>
        </div>

        <nav className="space-y-1 mb-6">
          <NavItem icon={<Home size={20} />} label="Home" onClick={() => setCurrentView('landing')} />
          <NavItem icon={<MessageSquare size={20} />} label="New Chat" />
          <NavItem icon={<ImageIcon size={20} />} label="Image" />
        </nav>

        <div className="space-y-2 mb-6">
          <div className={`${colors.bgCharacterHeader} rounded-lg p-3 flex justify-between items-center text-[#0a4559]`}>
            <span className="font-bold text-sm">Characters</span>
            <Sparkles size={16} />
          </div>
          <div className="space-y-2">
            <SubNavItem label="Silvermist" color={colors.bgSubItemDark} isActive={activeCharacter === 'Silvermist'} onClick={() => handleSwitchCharacter('Silvermist')} />
            <SubNavItem label="Periwinkle" color={colors.bgSubItemDark} isActive={activeCharacter === 'Periwinkle'} onClick={() => handleSwitchCharacter('Periwinkle')} />
            <SubNavItem label="Gliss" color={colors.bgSubItemDark} isActive={activeCharacter === 'Gliss'} onClick={() => handleSwitchCharacter('Gliss')} />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className={`${colors.bgItemActive} rounded-lg p-3 flex items-center gap-3 mb-2 cursor-pointer hover:brightness-110 transition-all`}>
            <LayoutGrid size={20} className="text-white" />
            <span className="font-semibold text-sm text-white">Your Chats</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {chatHistory.map((chat) => (
              <div key={chat.id} className="p-2.5 rounded-md hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 group transition-all">
                <p className="text-xs font-medium truncate text-white/70 group-hover:text-white">{chat.title}</p>
                <p className="text-[10px] text-white/40">{chat.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 mt-4">
          <div className={`${colors.bgCharacterHeader} rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all text-white`}>
            <UserRoundPen size={20} className="text-white" />
            <span className="font-bold text-sm truncate">Princess Channel B.</span>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop')` }}>
        <div className={`relative w-full max-w-5xl h-full lg:h-[90vh] bg-[#0a4559]/50 backdrop-blur-xl rounded-2xl lg:rounded-[40px] border transition-all duration-700 flex flex-col p-4 sm:p-6 lg:p-10 ${currentTheme.glow} ${currentTheme.border}`}>

          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1">
              <h2 className={`font-bold text-lg transition-colors duration-500 ${currentTheme.accent}`}>TinkerAI</h2>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 lg:space-y-8 pr-2 custom-scrollbar">
            {isTyping && !isLoading ? (
              <div className="flex justify-start animate-pop">
                <div className={`p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-xl border ${currentTheme.msgBg} ${currentTheme.border} backdrop-blur-md`}>
                  <div className="flex gap-1 items-center h-4 text-white">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-pop`}>
                    <div className={`max-w-[85%] lg:max-w-[65%] p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-xl border transition-all duration-500 ${msg.sender === 'user' ? 'bg-[#0a4559] text-white rounded-tr-none border-white/5' : `${currentTheme.msgBg} text-white rounded-tl-none ${currentTheme.border} backdrop-blur-md`}`}>
                      {msg.title && <h3 className={`font-bold text-lg lg:text-xl mb-1 lg:mb-2 transition-colors duration-500 ${currentTheme.accent}`}>{msg.title}</h3>}
                      <p className="text-xs lg:text-sm font-medium leading-relaxed text-white opacity-90 whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-pop">
                    <div className={`p-4 lg:p-6 rounded-2xl lg:rounded-3xl border ${currentTheme.msgBg} ${currentTheme.border} backdrop-blur-md`}>
                      <div className="flex gap-1 items-center h-4 text-white">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="mt-4 lg:mt-8 flex justify-center">
            <div className={`relative w-full max-w-2xl bg-[#0a4559] border transition-all duration-700 rounded-full flex items-center px-4 py-3 lg:px-6 lg:py-4 shadow-2xl ${currentTheme.border}`}>
              <div className="flex items-center gap-3 lg:gap-4 mr-2 lg:mr-4">
                <Paperclip className="w-4 lg:w-5 h-4 lg:h-5 text-white cursor-pointer" />
                <Mic className="w-4 lg:w-5 h-4 lg:h-5 text-white cursor-pointer" />
              </div>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Chatting with ${activeCharacter}...`}
                className="bg-transparent flex-1 outline-none text-white text-xs lg:text-sm placeholder:text-white/30 font-medium"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className={`ml-2 lg:ml-4 bg-[#e8dcc4] hover:bg-white transition-all rounded-full p-2 lg:p-2.5 shadow-lg active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <SendHorizontal className="w-4 lg:w-5 h-4 lg:h-5 text-[#0a4559]" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        
        @keyframes pop { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-pop { animation: pop 0.4s ease-out forwards; }

        @keyframes drift { 0% { transform: scale(1.0); } 50% { transform: scale(1.1) translateX(10px); } 100% { transform: scale(1.0); } }
        .animate-drift { animation: drift 20s ease-in-out infinite; }

        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }

        @keyframes glow { 0%, 100% { text-shadow: 0 0 10px rgba(232,220,196,0.2); } 50% { text-shadow: 0 0 40px rgba(232,220,196,0.8); } }
        .animate-glow { animation: glow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Sidebar;