import React, { useState } from 'react';
import { 
  Menu, Wand, UserCircle, Home, MessageSquare, 
  Image as ImageIcon, LayoutGrid, UserRoundPen,
  ChevronDown, Paperclip, Mic, SendHorizontal, X 
} from 'lucide-react';

// --- Helper Component: Main Sidebar Navigation Items ---
const NavItem = ({ icon, label }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#0c536b] cursor-pointer transition-all group active:scale-95">
    <span className="font-semibold text-sm">{label}</span>
    <span className="opacity-80 group-hover:opacity-100">{icon}</span>
  </div>
);

// --- Helper Component: Character List Items ---
const SubNavItem = ({ label, color, onClick, isActive }) => (
  <div 
    onClick={onClick}
    className={`${color} rounded-lg p-3 cursor-pointer hover:brightness-110 transition-all shadow-sm active:scale-95 border-2 ${isActive ? 'border-white/60 scale-105 shadow-lg' : 'border-transparent opacity-80'}`}
  >
    <span className="font-bold text-sm">{label}</span>
  </div>
);

// --- MAIN APPLICATION COMPONENT ---
const TinkerApp = () => {
  // 1. CHARACTER CONFIGURATION
  const characterGreetings = {
    'Periwinkle': "What subject can I help you with today?",
    'Silvermist': "Do you want to talk about something on your heart?",
    'Gliss': "What goal would you like to work on today?"
  };

  // UPDATED: THEMES WITH REQUESTED HEX COLORS
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
      glow: 'shadow-[0_0_40px_rgba(175,238,238,0.3)]', // rgba for #AFEEEE
      border: 'border-[#AFEEEE]/30',
      accent: 'text-[#AFEEEE]',
      msgBg: 'bg-[#AFEEEE]/10'
    }
  };

  // 2. STATES
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState('Periwinkle');
  
  const currentTheme = characterThemes[activeCharacter];

  // Initial message based on default character (Periwinkle)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      title: 'Hi, Princess Channel!',
      text: `I'm Periwinkle. ${characterGreetings['Periwinkle']}`,
    }
  ]);

  // 3. SWITCH CHARACTER FUNCTION (Unchanged as requested)
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
  };

  // Example data for Saved Chats
  const [chatHistory] = useState([
    { id: 1, title: "Moving on from heartbreak", date: "2 mins ago" },
    { id: 2, title: "Healthy morning routines", date: "1 hour ago" },
    { id: 3, title: "Gift ideas for sister", date: "Yesterday" },
  ]);

  // Color Palette Constants
  const colors = {
    bgMain: 'bg-[#0a4559]',
    bgItemActive: 'bg-[#0c536b]',
    bgCharacterHeader: 'bg-[#7899a7]',
    bgSubItemDark: 'bg-[#406d80]',
    bgSubItemLight: 'bg-[#7899a7]',
    textMain: 'text-white',
    creamAccent: '#e8dcc4'
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a4559] font-sans text-white">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 flex flex-col h-full ${colors.bgMain} p-5 border-r border-white/5
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-2">
            <Wand className={`w-6 h-6 -rotate-12 transition-colors duration-500 ${currentTheme.accent}`} />
            <h1 className="text-xl font-bold tracking-tight">TinkerAI</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1">
            <X className="w-6 h-6 text-white" />
          </button>
          <Menu className="hidden lg:block w-6 h-6 cursor-pointer opacity-80" />
        </div>

        {/* User Channel Profile */}
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="bg-white rounded-full p-0.5 shadow-md">
            <UserCircle className="w-8 h-8 text-[#0a4559]" />
          </div>
          <span className="font-semibold text-sm">Princess Channel</span>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 mb-6">
          <NavItem icon={<Home size={20} />} label="Home" />
          <NavItem icon={<MessageSquare size={20} />} label="New Chat" />
          <NavItem icon={<ImageIcon size={20} />} label="Image" />
        </nav>

        {/* Characters Section */}
        <div className="space-y-2 mb-6">
          <div className={`${colors.bgCharacterHeader} rounded-lg p-3 flex justify-between items-center shadow-inner text-[#0a4559]`}>
            <span className="font-bold text-sm">Characters</span>
            <div className="relative w-6 h-5 opacity-90 scale-90">
              <div className="absolute top-0 left-0 w-[11px] h-[11px] bg-[#e8dcc4] rounded-full" />
              <div className="absolute top-0 right-0 w-[11px] h-[11px] bg-[#e8dcc4] rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[16px] h-[16px] bg-[#e8dcc4] rounded-full" />
            </div>
          </div>
          
          <div className="space-y-2">
            <SubNavItem 
                label="Silvermist" 
                color={colors.bgSubItemDark} 
                isActive={activeCharacter === 'Silvermist'}
                onClick={() => handleSwitchCharacter('Silvermist')} 
            />
            <SubNavItem 
                label="Periwinkle" 
                color={colors.bgSubItemLight} 
                isActive={activeCharacter === 'Periwinkle'}
                onClick={() => handleSwitchCharacter('Periwinkle')} 
            />
            <SubNavItem 
                label="Gliss" 
                color={colors.bgSubItemDark} 
                isActive={activeCharacter === 'Gliss'}
                onClick={() => handleSwitchCharacter('Gliss')} 
            />
          </div>
        </div>

        {/* Your Chats & History Container */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className={`${colors.bgItemActive} rounded-lg p-3 flex items-center gap-3 mb-2 cursor-pointer hover:brightness-110 transition-all`}>
            <LayoutGrid size={20} className="opacity-80" />
            <span className="font-semibold text-sm">Your Chats</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {chatHistory.map((chat) => (
              <div key={chat.id} className="p-2.5 rounded-md hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 group transition-all">
                <p className="text-xs font-medium truncate opacity-70 group-hover:opacity-100">{chat.title}</p>
                <p className="text-[10px] opacity-40 group-hover:opacity-60">{chat.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/5 mt-4">
          <div className={`${colors.bgCharacterHeader} rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all text-[#0a4559]`}>
             <UserRoundPen size={20} />
             <span className="font-bold text-sm truncate">Princess Channel B.</span>
          </div>
        </div>
      </aside>

      {/* CHAT MAIN AREA */}
      <main 
        className="flex-1 relative flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop')` }}
      >
        {/* Glassmorphism Chat Container with Dynamic Glow */}
        <div className={`relative w-full max-w-5xl h-full lg:h-[90vh] bg-[#0a4559]/50 backdrop-blur-xl rounded-2xl lg:rounded-[40px] border transition-all duration-700 flex flex-col p-4 sm:p-6 lg:p-10 ${currentTheme.glow} ${currentTheme.border}`}>
          
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-white/80 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1">
              <h2 className={`font-bold text-lg transition-colors duration-500 ${currentTheme.accent}`}>TinkerAI</h2>
              <ChevronDown className="w-4 h-4 text-white/70" />
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto space-y-6 lg:space-y-8 pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-pop`}>
                <div className={`
                  max-w-[85%] lg:max-w-[65%] p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-xl border transition-all duration-500
                  ${msg.sender === 'user' 
                    ? 'bg-[#0a4559] text-white rounded-tr-none border-white/5' 
                    : `${currentTheme.msgBg} text-white rounded-tl-none ${currentTheme.border} backdrop-blur-md`}
                `}>
                  {msg.title && <h3 className={`font-bold text-lg lg:text-xl mb-1 lg:mb-2 transition-colors duration-500 ${currentTheme.accent}`}>{msg.title}</h3>}
                  <p className="text-xs lg:text-sm font-medium leading-relaxed opacity-90">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="mt-4 lg:mt-8 flex justify-center">
            <div className={`relative w-full max-w-2xl bg-[#0a4559] border transition-all duration-700 rounded-full flex items-center px-4 py-3 lg:px-6 lg:py-4 shadow-2xl ${currentTheme.border}`}>
              <div className="flex items-center gap-3 lg:gap-4 mr-2 lg:mr-4">
                <Paperclip className="w-4 lg:w-5 h-4 lg:h-5 text-white/50 cursor-pointer hover:text-white" />
                <Mic className="w-4 lg:w-5 h-4 lg:h-5 text-white/50 cursor-pointer hover:text-white" />
              </div>
              <input 
                type="text" 
                placeholder={`Chatting with ${activeCharacter}...`} 
                className="bg-transparent flex-1 outline-none text-white text-xs lg:text-sm placeholder:text-white/30 font-medium"
              />
              <button className={`ml-2 lg:ml-4 bg-[#e8dcc4] hover:bg-white transition-all rounded-full p-2 lg:p-2.5 shadow-lg active:scale-90`}>
                <SendHorizontal className="w-4 lg:w-5 h-4 lg:h-5 text-[#0a4559]" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

        @keyframes pop {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop {
          animation: pop 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TinkerApp;