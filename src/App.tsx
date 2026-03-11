/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap,
  Calculator, 
  Repeat,
  Clock,
  Rotate3d,
  BookOpen,
  Book,
  ShieldCheck,
  Gift,
  Heart,
  Briefcase,
  LayoutDashboard, 
  Settings, 
  MessageSquare, 
  Bell, 
  User, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Globe, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Code, 
  Smartphone, 
  Trophy, 
  Zap, 
  Crown,
  CheckCircle,
  Languages,
  QrCode,
  Hash,
  Scissors,
  Eraser,
  Mic,
  Volume2,
  Brain,
  PenTool,
  Camera,
  Map,
  BarChart,
  Link as LinkIcon,
  Percent,
  DollarSign,
  Pipette,
  Ruler
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Contexts ---
const AuthContext = createContext<any>(null);
const ThemeContext = createContext<any>(null);
const LanguageContext = createContext<any>(null);

// --- Components ---

const GlassCard = ({ children, className, onClick }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl",
      className
    )}
  >
    {children}
  </motion.div>
);

const GradientButton = ({ children, className, onClick, variant = "primary" }: any) => {
  const variants = {
    primary: "from-emerald-500 to-teal-600",
    secondary: "from-indigo-500 to-purple-600",
    premium: "from-amber-400 to-orange-500",
    danger: "from-rose-500 to-red-600"
  };
  
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all active:scale-95 bg-gradient-to-r",
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {children}
    </button>
  );
};

import BasicCalculator from './components/tools/Calculator';
import Translator from './components/tools/Translator';
import AIWriter from './components/tools/AIWriter';
import LoanCalculator from './components/tools/LoanCalculator';
import QRGenerator from './components/tools/QRGenerator';
import AIImageCreator from './components/tools/AIImageCreator';
import QuizContest from './components/QuizContest';
import PrimeGenerator from './components/tools/PrimeGenerator';
import WhatsappLinkCreator from './components/tools/WhatsappLinkCreator';
import CVBuilder from './components/tools/CVBuilder';
import Chat from './components/Chat';
import Summarizer from './components/tools/Summarizer';
import GrammarCheck from './components/tools/GrammarCheck';
import PercentageCalculator from './components/tools/PercentageCalculator';
import MathSolver from './components/tools/MathSolver';
import IDCardGenerator from './components/tools/IDCardGenerator';
import TextToVoice from './components/tools/TextToVoice';
import VoiceToText from './components/tools/VoiceToText';
import PlantID from './components/tools/PlantID';
import ImageToText from './components/tools/ImageToText';
import LogoCreator from './components/tools/LogoCreator';
import CartoonAvatarCreator from './components/tools/CartoonAvatarCreator';
import Subscription from './components/Subscription';
import BackgroundRemover from './components/tools/BackgroundRemover';
import PDFTools from './components/tools/PDFTools';
import VideoEditor from './components/tools/VideoEditor';
import PhotoEditor from './components/tools/PhotoEditor';
import GPACalculator from './components/tools/GPACalculator';
import UnitConverter from './components/tools/UnitConverter';
import PomodoroTimer from './components/tools/PomodoroTimer';
import Flashcards from './components/tools/Flashcards';
import CitationGenerator from './components/tools/CitationGenerator';
import Dictionary from './components/tools/Dictionary';
import PlagiarismChecker from './components/tools/PlagiarismChecker';
import GiftCardGenerator from './components/tools/GiftCardGenerator';
import WishCardGenerator from './components/tools/WishCardGenerator';
import BusinessCardGenerator from './components/tools/BusinessCardGenerator';
import FlyerGenerator from './components/tools/FlyerGenerator';
import PhotoMath from './components/tools/PhotoMath';
import ColorIdentifier from './components/tools/ColorIdentifier';
import ARMeasure from './components/tools/ARMeasure';
import DocScanner from './components/tools/DocScanner';
import ContactPopup from './components/ContactPopup';
import NoticeboardPopup from './components/NoticeboardPopup';

// --- Admin Dashboard ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [view, setView] = useState<'overview' | 'users' | 'activity'>('overview');

  useEffect(() => {
    fetch('/api/admin/users').then(res => res.json()).then(setUsers);
    fetch('/api/admin/activity').then(res => res.json()).then(setLogs);
  }, []);

  const addNotice = async () => {
    if (!noticeTitle || !noticeContent) return;
    await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: noticeTitle, content: noticeContent })
    });
    alert('Notice added successfully!');
    setNoticeTitle('');
    setNoticeContent('');
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={() => navigate('/dashboard')}><X /></button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <button onClick={() => setView('overview')} className={`px-4 py-2 rounded-full text-xs font-bold ${view === 'overview' ? 'bg-emerald-500 text-black' : 'bg-white/5'}`}>Overview</button>
        <button onClick={() => setView('users')} className={`px-4 py-2 rounded-full text-xs font-bold ${view === 'users' ? 'bg-emerald-500 text-black' : 'bg-white/5'}`}>Users ({users.length})</button>
        <button onClick={() => setView('activity')} className={`px-4 py-2 rounded-full text-xs font-bold ${view === 'activity' ? 'bg-emerald-500 text-black' : 'bg-white/5'}`}>Activity</button>
      </div>
      
      {view === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="flex flex-col items-center gap-2">
            <User size={32} className="text-emerald-400" />
              <span>Users</span>
            </GlassCard>
            <GlassCard className="flex flex-col items-center gap-2">
              <Trophy size={32} className="text-amber-400" />
              <span>Quizzes</span>
            </GlassCard>
          </div>

          <GlassCard className="space-y-4">
            <h3 className="font-bold border-b border-white/10 pb-2">Post New Notice</h3>
            <input 
              placeholder="Notice Title"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
            />
            <textarea 
              placeholder="Notice Content"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
            />
            <GradientButton onClick={addNotice} className="w-full">Post Notice</GradientButton>
          </GlassCard>
        </div>
      )}

      {view === 'users' && (
        <div className="space-y-4">
          {users.map(u => (
            <div key={u.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
              <div>
                <p className="font-bold">{u.name}</p>
                <p className="text-xs text-white/40">{u.userId} • {u.subscription_status}</p>
              </div>
              <button onClick={() => deleteUser(u.id)} className="p-2 text-rose-500"><Eraser size={18} /></button>
            </div>
          ))}
        </div>
      )}

      {view === 'activity' && (
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs flex justify-between">
              <div>
                <span className="font-bold text-emerald-400">{log.username}</span>
                <p className="text-white/60 mt-1">{log.action}</p>
              </div>
              <span className="text-white/20">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/notices').then(res => res.json()).then(setNotices);
  }, []);

  const deleteNotice = async (id: number) => {
    if (!confirm('Delete this notice?')) return;
    await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    setNotices(notices.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mod Panel</h1>
        <button onClick={() => navigate('/dashboard')}><X /></button>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="flex flex-col items-center gap-2 text-center p-4">
            <Bell size={24} className="text-emerald-400" />
            <span className="text-xs font-bold">Notices</span>
          </GlassCard>
          <GlassCard className="flex flex-col items-center gap-2 text-center p-4">
            <MessageSquare size={24} className="text-emerald-400" />
            <span className="text-xs font-bold">Support</span>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold border-b border-white/10 pb-2 flex items-center gap-2">
            <Bell size={18} /> Active Notices
          </h3>
          {notices.map(n => (
            <div key={n.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <p className="font-bold text-sm">{n.title}</p>
                <p className="text-xs text-white/40 mt-1 line-clamp-2">{n.content}</p>
              </div>
              <button onClick={() => deleteNotice(n.id)} className="p-2 text-rose-500">
                <Eraser size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-900 via-slate-900 to-black text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        <div className="w-24 h-24 bg-emerald-500/20 backdrop-blur-xl rounded-3xl mx-auto flex items-center justify-center border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
          <GraduationCap size={48} className="text-emerald-400" />
        </div>
        <h1 className="text-6xl font-bold tracking-tighter">EduTools<span className="text-emerald-400">Pro</span></h1>
        <p className="text-xl text-white/70 max-w-md mx-auto">
          Your ultimate educational companion. Empowering students with AI-driven tools.
        </p>
        <div className="flex flex-col gap-4">
          <GradientButton onClick={() => navigate('/onboarding')} className="bg-gradient-to-r from-emerald-500 to-teal-600">Get Started</GradientButton>
          <button onClick={() => navigate('/login')} className="text-white/60 hover:text-white transition-colors">
            Already have an account? Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', phone: '', password: '',
    class: '', roll: '', school: '', address: ''
  });
  const navigate = useNavigate();

  const steps = [
    { title: "Personal Info", fields: ['name', 'username', 'email', 'phone', 'password'] },
    { title: "Educational Info", fields: ['class', 'roll', 'school', 'address'] }
  ];

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert(`Registration successful! Your ID: ${data.userId}`);
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-900 to-slate-900">
      <GlassCard className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>
        <div className="space-y-4">
          {steps[step].fields.map(field => (
            <input
              key={field}
              type={field === 'password' ? 'password' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={(formData as any)[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {step > 0 && <button onClick={() => setStep(step - 1)} className="text-white/60">Back</button>}
          <GradientButton onClick={handleNext} className="ml-auto bg-gradient-to-r from-emerald-500 to-teal-600">
            {step === steps.length - 1 ? 'Finish' : 'Next'}
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (data.success) {
      login(data.user);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'moderator') navigate('/moderator');
      else navigate('/dashboard');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-900 to-slate-900">
      <GlassCard className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-white">Login</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email, Username or Phone"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <GradientButton onClick={handleLogin} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">Login</GradientButton>
        <p className="text-center text-white/60">
          Don't have an account? <Link to="/onboarding" className="text-emerald-400">Register</Link>
        </p>
      </GlassCard>
    </div>
  );
};

const Dashboard = ({ onOpenNotice }: { onOpenNotice: () => void }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const tools = [
    { name: "GPA Calc", icon: <GraduationCap />, path: "/tools/gpa", premium: false },
    { name: "Unit Converter", icon: <Repeat />, path: "/tools/unit-converter", premium: false },
    { name: "Study Timer", icon: <Clock />, path: "/tools/pomodoro", premium: false },
    { name: "Flashcards", icon: <Rotate3d />, path: "/tools/flashcards", premium: false },
    { name: "Citation", icon: <BookOpen />, path: "/tools/citation", premium: false },
    { name: "Dictionary", icon: <Book />, path: "/tools/dictionary", premium: false },
    { name: "Plagiarism", icon: <ShieldCheck />, path: "/tools/plagiarism", premium: true },
    { name: "Gift Card", icon: <Gift />, path: "/tools/gift-card", premium: true },
    { name: "Wish Card", icon: <Heart />, path: "/tools/wish-card", premium: true },
    { name: "Business Card", icon: <Briefcase />, path: "/tools/business-card", premium: true },
    { name: "Flyer Gen", icon: <FileText />, path: "/tools/flyer", premium: true },
    { name: "Calculator", icon: <Calculator />, path: "/tools/calculator", premium: false },
    { name: "Loan Calculator", icon: <DollarSign />, path: "/tools/loan", premium: false },
    { name: "Translator", icon: <Languages />, path: "/tools/translator", premium: false },
    { name: "QR Generator", icon: <QrCode />, path: "/tools/qr", premium: false },
    { name: "Percentage", icon: <Percent />, path: "/tools/percentage", premium: false },
    { name: "Grammar Check", icon: <CheckCircle />, path: "/tools/grammar", premium: false },
    { name: "Prime Gen", icon: <Hash />, path: "/tools/prime", premium: false },
    { name: "WA Link", icon: <LinkIcon />, path: "/tools/whatsapp", premium: false },
    { name: "Image to Text", icon: <FileText />, path: "/tools/image-to-text", premium: false },
    { name: "Text to Voice", icon: <Volume2 />, path: "/tools/text-to-voice", premium: false },
    { name: "Voice to Text", icon: <Mic />, path: "/tools/voice-to-text", premium: false },
    { name: "PDF Tools", icon: <FileText />, path: "/tools/pdf", premium: false },
    { name: "Logo Creator", icon: <PenTool />, path: "/tools/logo-creator", premium: false },
    { name: "Avatar Creator", icon: <User />, path: "/tools/avatar-creator", premium: false },
    { name: "AI Math", icon: <Brain />, path: "/tools/math-solver", premium: true },
    { name: "AI Summarize", icon: <FileText />, path: "/tools/summarize", premium: true },
    { name: "CV Builder", icon: <FileText />, path: "/tools/cv-builder", premium: true },
    { name: "AI Image", icon: <ImageIcon />, path: "/tools/ai-image", premium: true },
    { name: "AI Writer", icon: <Brain />, path: "/tools/ai-writer", premium: true },
    { name: "Video Editor", icon: <Video />, path: "/tools/video-editor", premium: true },
    { name: "Photo Editor", icon: <ImageIcon />, path: "/tools/photo-editor", premium: true },
    { name: "BG Remover", icon: <Scissors />, path: "/tools/bg-remover", premium: true },
    { name: "ID Card", icon: <Shield />, path: "/tools/id-card", premium: true },
    { name: "Plant ID", icon: <Camera />, path: "/tools/plant-id", premium: true },
    { name: "Photo Math", icon: <Calculator />, path: "/tools/photo-math", premium: true },
    { name: "Color ID", icon: <Pipette />, path: "/tools/color-id", premium: true },
    { name: "AR Measure", icon: <Ruler />, path: "/tools/ar-measure", premium: true },
    { name: "Doc Scanner", icon: <FileText />, path: "/tools/doc-scanner", premium: true },
  ];

  const handleToolClick = (tool: any) => {
    if (tool.premium && user?.subscription_status !== 'premium') {
      alert('This is a Premium Tool. Please upgrade to access.');
      navigate('/subscription');
    } else {
      navigate(tool.path);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <GraduationCap size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Hello, {user?.name}</h1>
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">ID: {user?.userId}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onOpenNotice} className="p-2 bg-white/5 rounded-full"><Bell size={20} /></button>
          <button onClick={() => navigate('/profile')} className="p-2 bg-white/5 rounded-full"><User size={20} /></button>
        </div>
      </header>

      <GlassCard className="mb-8 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Premium Status</h3>
            <p className="text-white/60 text-sm">{user?.subscription_status === 'premium' ? 'Active' : 'Free Plan'}</p>
          </div>
          {user?.subscription_status !== 'premium' && (
            <GradientButton variant="premium" onClick={() => navigate('/subscription')} className="bg-gradient-to-r from-emerald-500 to-teal-600">Upgrade</GradientButton>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        {tools.map(tool => (
          <GlassCard 
            key={tool.name} 
            onClick={() => handleToolClick(tool)}
            className="flex flex-col items-center justify-center gap-3 py-8"
          >
            <div className={cn("p-3 rounded-2xl", tool.premium ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400")}>
              {tool.icon}
            </div>
            <span className="font-medium text-sm text-center">{tool.name}</span>
            {tool.premium && <Crown size={12} className="text-amber-400" />}
          </GlassCard>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center">
        <Link to="/dashboard" className="text-emerald-400"><LayoutDashboard /></Link>
        <Link to="/quiz" className="text-white/40"><Trophy /></Link>
        <Link to="/chat" className="text-white/40"><MessageSquare /></Link>
        <Link to="/profile" className="text-white/40"><User /></Link>
      </nav>
    </div>
  );
};

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)}><X /></button>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <GlassCard className="flex flex-col items-center gap-4 mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-4xl font-bold text-black">
          {user?.name?.[0]}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-white/50">@{user?.username}</p>
          <p className="text-emerald-400 font-mono mt-1">{user?.userId}</p>
        </div>
        <div className="flex gap-2">
          {user?.subscription_status === 'premium' ? (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs flex items-center gap-1">
              <Crown size={12} /> Premium
            </span>
          ) : (
            <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-xs">Free User</span>
          )}
        </div>
      </GlassCard>

      <div className="space-y-4">
        <GlassCard className="space-y-4">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">School</span>
            <span>{user?.school}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">Class</span>
            <span>{user?.class}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">Roll</span>
            <span>{user?.roll}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">Phone</span>
            <span>{user?.phone}</span>
          </div>
        </GlassCard>

        <GradientButton variant="danger" className="w-full" onClick={logout}>
          <div className="flex items-center justify-center gap-2">
            <LogOut size={20} /> Logout
          </div>
        </GradientButton>
      </div>
    </div>
  );
};

// --- App Component ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasVisited = localStorage.getItem('hasVisitedBefore');

    if (!hasVisited && !isStandalone) {
      alert("Welcome to EduToolsPro! For the best experience, you can install this app on your device.");
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <LanguageContext.Provider value={{ lang, setLang }}>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={user ? <Dashboard onOpenNotice={() => setIsNoticeOpen(true)} /> : <Navigate to="/login" />} />
                <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
                <Route path="/moderator" element={user?.role === 'moderator' ? <ModeratorDashboard /> : <Navigate to="/dashboard" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/tools/calculator" element={<BasicCalculator />} />
                <Route path="/tools/translator" element={<Translator />} />
                <Route path="/tools/ai-writer" element={<AIWriter />} />
                <Route path="/tools/loan" element={<LoanCalculator />} />
                <Route path="/tools/qr" element={<QRGenerator />} />
                <Route path="/tools/ai-image" element={<AIImageCreator />} />
                <Route path="/quiz" element={<QuizContest />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/tools/prime" element={<PrimeGenerator />} />
                <Route path="/tools/whatsapp" element={<WhatsappLinkCreator />} />
                <Route path="/tools/cv-builder" element={<CVBuilder />} />
                <Route path="/tools/summarize" element={<Summarizer />} />
                <Route path="/tools/grammar" element={<GrammarCheck />} />
                <Route path="/tools/percentage" element={<PercentageCalculator />} />
                <Route path="/tools/math-solver" element={<MathSolver />} />
                <Route path="/tools/id-card" element={<IDCardGenerator />} />
                <Route path="/tools/text-to-voice" element={<TextToVoice />} />
                <Route path="/tools/voice-to-text" element={<VoiceToText />} />
                <Route path="/tools/plant-id" element={<PlantID />} />
                <Route path="/tools/image-to-text" element={<ImageToText />} />
                <Route path="/tools/logo-creator" element={<LogoCreator />} />
                <Route path="/tools/avatar-creator" element={<CartoonAvatarCreator />} />
                <Route path="/tools/video-editor" element={<VideoEditor />} />
                <Route path="/tools/photo-editor" element={<PhotoEditor />} />
                <Route path="/tools/bg-remover" element={<BackgroundRemover />} />
                <Route path="/tools/pdf" element={<PDFTools />} />
                <Route path="/tools/gpa" element={<GPACalculator />} />
                <Route path="/tools/unit-converter" element={<UnitConverter />} />
                <Route path="/tools/pomodoro" element={<PomodoroTimer />} />
                <Route path="/tools/flashcards" element={<Flashcards />} />
                <Route path="/tools/citation" element={<CitationGenerator />} />
                <Route path="/tools/dictionary" element={<Dictionary />} />
                <Route path="/tools/plagiarism" element={<PlagiarismChecker />} />
                <Route path="/tools/gift-card" element={<GiftCardGenerator />} />
                <Route path="/tools/wish-card" element={<WishCardGenerator />} />
                <Route path="/tools/business-card" element={<BusinessCardGenerator />} />
                <Route path="/tools/flyer" element={<FlyerGenerator />} />
                <Route path="/tools/photo-math" element={<PhotoMath />} />
                <Route path="/tools/color-id" element={<ColorIdentifier />} />
                <Route path="/tools/ar-measure" element={<ARMeasure />} />
                <Route path="/tools/doc-scanner" element={<DocScanner />} />
                <Route path="/subscription" element={<Subscription />} />
              </Routes>
            </AnimatePresence>

            {user && (
              <button 
                onClick={() => setIsContactOpen(true)}
                className="fixed right-6 bottom-24 z-40 w-14 h-14 bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center text-black active:scale-90 transition-all"
              >
                <MessageSquare />
              </button>
            )}

            <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            <NoticeboardPopup isOpen={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} />
          </Router>
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
