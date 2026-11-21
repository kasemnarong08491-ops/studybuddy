import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import {
  Search, Plus, Compass, User, MapPin, Calendar, ArrowRight,
  ArrowLeft, Send, LogIn, LogOut, Users, Mail, Lock,
  MessageCircle, X, CheckCircle, Bell, Edit, Trash2, Clock,
  UserPlus, UserMinus, Check, ShieldAlert, Paperclip, LogOut as LeaveIcon,
  BookOpen, Sparkles, GraduationCap, ChevronRight, Camera
} from 'lucide-react';

// --- AVATARS DATA ---
const cartoonAvatars = [
  { id: 'm1', gender: 'ชาย', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23E0E7FF"/><circle cx="50" cy="40" r="22" fill="%23FDBA74"/><path d="M30,35 Q50,15 70,35 Q65,22 50,22 Q35,22 30,35 Z" fill="%231E293B"/><circle cx="43" cy="38" r="2.5" fill="%231E293B"/><circle cx="57" cy="38" r="2.5" fill="%231E293B"/><path d="M44,48 Q50,54 56,48" stroke="%23C2410C" stroke-width="2" fill="none"/><path d="M20,90 Q50,65 80,90 Z" fill="%234338CA"/></svg>' },
  { id: 'm2', gender: 'ชาย', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FEF3C7"/><circle cx="50" cy="40" r="22" fill="%23FED7AA"/><path d="M28,32 Q50,10 72,32 Q60,18 50,18 Q40,18 28,32 Z" fill="%23475569"/><circle cx="43" cy="38" r="2.5" fill="%231E293B"/><circle cx="57" cy="38" r="2.5" fill="%231E293B"/><path d="M45,49 Q50,53 55,49" stroke="%23EA580C" stroke-width="2" fill="none"/><path d="M20,90 Q50,65 80,90 Z" fill="%23D97706"/></svg>' },
  { id: 'm3', gender: 'ชาย', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23DCFCE7"/><circle cx="50" cy="40" r="22" fill="%23FFEDD5"/><path d="M32,30 Q50,12 68,30 Q60,20 50,20 Q40,20 32,30 Z" fill="%230F172A"/><circle cx="43" cy="38" r="2.5" fill="%231E293B"/><circle cx="57" cy="38" r="2.5" fill="%231E293B"/><path d="M44,48 Q50,54 56,48" stroke="%23C2410C" stroke-width="2" fill="none"/><path d="M20,90 Q50,65 80,90 Z" fill="%23059669"/></svg>' },
  { id: 'f1', gender: 'หญิง', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FCE7F3"/><circle cx="50" cy="42" r="21" fill="%23FED7AA"/><path d="M25,28 Q50,12 75,28 C80,50 75,65 72,70 Q50,22 28,70 C25,65 20,50 25,28 Z" fill="%23831843"/><circle cx="43" cy="40" r="2.5" fill="%231E293B"/><circle cx="57" cy="40" r="2.5" fill="%231E293B"/><path d="M44,50 Q50,56 56,50" stroke="%23BE185D" stroke-width="2" fill="none"/><path d="M22,90 Q50,68 78,90 Z" fill="%23DB2777"/></svg>' },
  { id: 'f2', gender: 'หญิง', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23F3E8FF"/><circle cx="50" cy="42" r="21" fill="%23FDBA74"/><path d="M24,30 Q50,10 76,30 C78,55 72,70 70,72 Q50,20 30,72 C28,70 22,55 24,30 Z" fill="%23312E81"/><circle cx="43" cy="40" r="2.5" fill="%231E293B"/><circle cx="57" cy="40" r="2.5" fill="%231E293B"/><path d="M44,50 Q50,55 56,50" stroke="%23C2410C" stroke-width="2" fill="none"/><path d="M22,90 Q50,68 78,90 Z" fill="%237C3AED"/></svg>' },
  { id: 'f3', gender: 'หญิง', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FFE4E6"/><circle cx="50" cy="42" r="21" fill="%23FFEDD5"/><path d="M25,26 Q50,8 75,26 C78,48 74,68 70,72 Q50,18 30,72 C26,68 22,48 25,26 Z" fill="%23881337"/><circle cx="43" cy="40" r="2.5" fill="%231E293B"/><circle cx="57" cy="38" r="2.5" fill="%231E293B"/><path d="M44,50 Q50,56 56,50" stroke="%23E11D48" stroke-width="2" fill="none"/><path d="M22,90 Q50,68 78,90 Z" fill="%23E11D48"/></svg>' }
];

// --- THEME COLOR CONFIG ---
const themePresets = {
  indigo: {
    name: 'Indigo',
    bg: 'from-indigo-900 via-slate-900 to-black',
    cardGlow: 'shadow-indigo-500/20 border-indigo-500/30',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30',
    accentText: 'text-indigo-400',
    dotBg: 'bg-indigo-600',
    particleColor: '99, 102, 241'
  }
};

const getStudySessionDate = (dateTime) => {
  const [rawDateLabel = '', rawTimeLabel = ''] = String(dateTime || '').split('|');
  const dateLabel = rawDateLabel.trim();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let sessionDate = null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateLabel)) {
    const [year, month, day] = dateLabel.split('-').map(Number);
    sessionDate = new Date(year, month - 1, day);
  } else if (dateLabel === 'วันนี้') {
    sessionDate = new Date(today);
  } else if (dateLabel === 'พรุ่งนี้') {
    sessionDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  } else if (dateLabel === 'เสาร์นี้') {
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    sessionDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilSaturday);
  }
  if (!sessionDate) return null;

  const timeMatch = rawTimeLabel.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) sessionDate.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
  else sessionDate.setHours(23, 59, 59, 999);
  return sessionDate;
};

const getMessageDayKey = (createdAt) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const formatMessageDayLabel = (createdAt) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  if (getMessageDayKey(createdAt) === getMessageDayKey(today)) return 'วันนี้';
  if (getMessageDayKey(createdAt) === getMessageDayKey(yesterday)) return 'เมื่อวาน';
  return date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const cleanProfileName = (name) => String(name || '').replace(/(?:\s*\(นักศึกษา SPU\))+\s*$/, '').trim();

const GenderBadge = ({ gender }) => {
  const value = String(gender || '').trim().toLowerCase();
  if (value === 'male' || value === 'ชาย') {
    return <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-600">♂</span>;
  }
  if (value === 'female' || value === 'หญิง') {
    return <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-500">♀</span>;
  }
  return null;
};

function StudyBuddyBit({ className = '', mood = 'wave' }) {
  return (
    <svg viewBox="0 0 120 132" className={`bit-mascot bit-mascot--${mood} ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bit-body-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5B4FC" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="bit-screen-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26345D" />
          <stop offset="100%" stopColor="#111A35" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="119" rx="28" ry="5" fill="#312E81" opacity="0.12" className="bit-mascot__shadow" />
      {mood === 'thinking' && (
        <g className="bit-mascot__thought" aria-hidden="true">
          <circle cx="101" cy="25" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          <text x="101" y="31" textAnchor="middle" fill="#92400E" fontSize="18" fontWeight="800">?</text>
        </g>
      )}
      {mood === 'cheer' && (
        <g className="bit-mascot__confetti" aria-hidden="true" strokeLinecap="round">
          <path d="m16 44 5-5m-7 15 7-1m84-18 5 5m-1 11 7 2" stroke="#F59E0B" strokeWidth="3" />
          <path d="m24 27 2 4m70-7-2 5" stroke="#EC4899" strokeWidth="3" />
          <path d="m16 91 5-4m81 8 5 4" stroke="#22D3EE" strokeWidth="3" />
        </g>
      )}
      <g className="bit-mascot__float">
        <path d="M60 31V21" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="16" r="7" fill="#FBBF24" className="bit-mascot__antenna" />
        <circle cx="58" cy="14" r="2" fill="#FFF7CC" opacity="0.95" />

        <path d="M31 70 19 76" stroke="#818CF8" strokeWidth="9" strokeLinecap="round" />
        <circle cx="17" cy="77" r="6" fill="#C7D2FE" />
        <g className="bit-mascot__wave-arm">
          <path d="m88 69 13-9" stroke="#6366F1" strokeWidth="9" strokeLinecap="round" />
          <circle cx="105" cy="57" r="7" fill="#FBBF24" />
          <path d="m105 46 1-4m9 9 4-2m-13 18 1 4" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        <rect x="29" y="31" width="62" height="77" rx="22" fill="url(#bit-body-gradient)" stroke="#4F46E5" strokeWidth="2.5" />
        <rect x="37" y="43" width="46" height="36" rx="13" fill="url(#bit-screen-gradient)" />
        <g className="bit-mascot__eyes" fill="#E0E7FF">
          <ellipse cx="50" cy="58" rx="3.2" ry="4.2" />
          <ellipse cx="70" cy="58" rx="3.2" ry="4.2" />
        </g>
        <path d="M53 68q7 7 14 0" fill="none" stroke="#A5F3FC" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="41" cy="69" r="2.5" fill="#F9A8D4" opacity="0.9" />
        <circle cx="79" cy="69" r="2.5" fill="#F9A8D4" opacity="0.9" />
        <rect x="43" y="86" width="34" height="11" rx="5.5" fill="#EEF2FF" opacity="0.96" />
        <circle cx="52" cy="91.5" r="2" fill="#6366F1" />
        <circle cx="60" cy="91.5" r="2" fill="#818CF8" />
        <circle cx="68" cy="91.5" r="2" fill="#A5B4FC" />
        <path d="M44 108v5m32-5v5" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" />
        <path d="M38 115h12m22 0h12" stroke="#312E81" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
      </g>
    </svg>
  );
}

export default function App() {
  // Lighting & Sound State
  const [isSparking, setIsSparking] = useState(false);
  const [bitMood, setBitMood] = useState('wave');
  const [bitPhraseIndex, setBitPhraseIndex] = useState(0);

  // Mouse Glow & Starfall Canvas Tracking
  const rainCanvasRef = useRef(null);
  const mapIframeRef = useRef(null);
  const mapPageScrollRef = useRef(null);
  const mapIframeWheelHandlerRef = useRef(null);

  // Navigation & Search State
  const [currentTab, setCurrentTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [groupSortMode, setGroupSortMode] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Data States
  const [studyGroups, setStudyGroups] = useState([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(true);
  const [groupsLoadError, setGroupsLoadError] = useState('');
  const [myJoinedGroupIds, setMyJoinedGroupIds] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Profile & Auth
  const savedAvatar = localStorage.getItem('user_profile_avatar');
  const savedGender = localStorage.getItem('user_profile_gender') || 'ชาย';
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [selectedGender, setSelectedGender] = useState(savedGender);
  const [currentUser, setCurrentUser] = useState({ name: 'Guest User', gender: savedGender, avatar: savedAvatar || cartoonAvatars[0].url });

  // Auth Forms
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSavedProfile, setIsSavedProfile] = useState(false);

  // Social & Requests
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [toastNotification, setToastNotification] = useState(null);
  const [actionToast, setActionToast] = useState(null);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showQuickFriendModal, setShowQuickFriendModal] = useState(false);

  // Group Form
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ภาษาต่างประเทศ');
  const [locationText, setLocationText] = useState('อาคาร 11 ชั้น 5 (สำนักหอสมุด SPU)');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedMapLocation, setSelectedMapLocation] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupDate, setGroupDate] = useState('');
  const [groupTime, setGroupTime] = useState('13:00 - 15:00 น.');
  const [customGroupTime, setCustomGroupTime] = useState('');
  const [maxMembersInput, setMaxMembersInput] = useState(5);

  // Group Members
  const [groupMembers, setGroupMembers] = useState([]);
  const [allPendingRequests, setAllPendingRequests] = useState([]);
  const [showMemberListModal, setShowMemberListModal] = useState(false);

  // Chats
  const [roomChatMessages, setRoomChatMessages] = useState([]);
  const [roomChatMsg, setRoomChatMsg] = useState('');
  const [isRoomChatLoading, setIsRoomChatLoading] = useState(true);
  const [roomChatLoadError, setRoomChatLoadError] = useState('');
  const [animatedRoomMessageId, setAnimatedRoomMessageId] = useState(null);
  const [isRoomSendAnimating, setIsRoomSendAnimating] = useState(false);
  const [newRoomMessageMarkerId, setNewRoomMessageMarkerId] = useState(null);
  const [newRoomMessagesCount, setNewRoomMessagesCount] = useState(0);
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const [searchedFriends, setSearchedFriends] = useState([]);
  const [isSearchingRealtime, setIsSearchingRealtime] = useState(false);
  const [activePrivateMember, setActivePrivateMember] = useState(null);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateMsgInput, setPrivateMsgInput] = useState('');
  const [recentDMMessages, setRecentDMMessages] = useState({});
  const [recentGroupMessages, setRecentGroupMessages] = useState({});

  // Refs & Tracking
  const chatEndRef = useRef(null);
  const roomChatContainerRef = useRef(null);
  const roomChatInputRef = useRef(null);
  const roomChatAtBottomRef = useRef(true);
  const unseenRoomMessageIdsRef = useRef(new Set());
  const privateChatContainerRef = useRef(null);
  const homeSearchInputRef = useRef(null);
  const readMessageIdsRef = useRef(new Set(JSON.parse(localStorage.getItem('read_msg_ids') || '[]')));
  const friendRequestPartnerRef = useRef(new window.Map());
  const friendSyncChannelRef = useRef(null);
  const groupMembershipStatusRef = useRef(new window.Map());
  const fallbackGroupToastIdsRef = useRef(new window.Set());
  const actionToastTimerRef = useRef(null);
  const avatarFileInputRef = useRef(null);

  const notifyUser = (message, type = null) => {
    const messageText = String(message);
    const resolvedType = type || (
      /ไม่สำเร็จ|ข้อผิดพลาด|กรุณา|ไม่สามารถ|ถูกปฏิเสธ|error|failed/i.test(messageText)
        ? 'error'
        : /สำเร็จ|เรียบร้อย/.test(messageText)
          ? 'success'
          : 'info'
    );

    if (actionToastTimerRef.current) window.clearTimeout(actionToastTimerRef.current);
    if (resolvedType === 'success') {
      setBitMood('cheer');
      setBitPhraseIndex(3);
    } else if (resolvedType === 'error') {
      setBitMood('thinking');
      setBitPhraseIndex(2);
    } else {
      setBitMood('wave');
    }
    setActionToast({ message: messageText, type: resolvedType });
    actionToastTimerRef.current = window.setTimeout(() => {
      setActionToast(null);
      setBitMood('wave');
    }, resolvedType === 'error' ? 6500 : 4200);
  };

  const dismissActionToast = () => {
    if (actionToastTimerRef.current) window.clearTimeout(actionToastTimerRef.current);
    setActionToast(null);
    setBitMood('wave');
  };

  useEffect(() => () => {
    if (actionToastTimerRef.current) window.clearTimeout(actionToastTimerRef.current);
  }, []);

  // 🔔 WEB AUDIO SYNTHESIZER: เสียงกระดิ่งแจ้งเตือนนุ่มๆ (Notification Chime)
  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      // โน้ตตัวที่ 1 (E5 - 659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.28);

      // โน้ตตัวที่ 2 (B5 - 987.77 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.2, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.log('Notification Sound Error:', e);
    }
  };


  const currentThemeObj = themePresets.indigo;

  // 🌧️ 1. RAIN ANIMATION ENGINE
  useEffect(() => {
    if (user) return;
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const drops = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 12,
      speed: Math.random() * 7 + 5,
      opacity: Math.random() * 0.4 + 0.1
    }));

    const renderRain = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= 0.5;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      });
      animationFrameId = requestAnimationFrame(renderRain);
    };

    renderRain();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [user]);


  const markMessageAsRead = (msgId) => {
    if (!msgId) return;
    readMessageIdsRef.current.add(msgId);
    localStorage.setItem('read_msg_ids', JSON.stringify(Array.from(readMessageIdsRef.current)));
  };

  const handleIncomingRoomMessage = (message) => {
    const isOwnMessage = message.sender_name === currentUser.name;
    const shouldFollowLatest = roomChatAtBottomRef.current || isOwnMessage;
    setRoomChatMessages(prev => {
      if (prev.some(existing => String(existing.id) === String(message.id))) return prev;
      return [...prev, message];
    });

    if (shouldFollowLatest) {
      markMessageAsRead(message.id);
      setTimeout(() => scrollToBottom(true, roomChatContainerRef), 20);
      return;
    }

    const messageId = String(message.id);
    if (!unseenRoomMessageIdsRef.current.has(messageId)) {
      unseenRoomMessageIdsRef.current.add(messageId);
      setNewRoomMessagesCount(unseenRoomMessageIdsRef.current.size);
    }
    setNewRoomMessageMarkerId(currentId => currentId || messageId);
  };

  const handleRoomChatScroll = (event) => {
    const container = event.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    roomChatAtBottomRef.current = isAtBottom;
    if (!isAtBottom || unseenRoomMessageIdsRef.current.size === 0) return;
    unseenRoomMessageIdsRef.current.forEach(markMessageAsRead);
    unseenRoomMessageIdsRef.current.clear();
    setNewRoomMessagesCount(0);
    setNewRoomMessageMarkerId(null);
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'เมื่อสักครู่';
    const date = new Date(isoString);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
  };

  const isHost = (group = selectedGroup) => {
    if (!group) return false;
    const isIdMatch = user?.id && String(group.host_id) === String(user.id);
    const isEmailMatch = user?.email && String(group.host_id) === String(user.email);
    return Boolean(isIdMatch || isEmailMatch);
  };

  const isApprovedMember = (group = selectedGroup) => {
    if (!group) return false;
    if (isHost(group)) return true;
    const currentUserId = user?.id || user?.email;
    return groupMembers.some(m =>
      (m.user_id === currentUserId || m.user_name === currentUser.name) && m.status === 'accepted'
    );
  };

  const scrollToBottom = (force = false, containerRef = null) => {
    if (!containerRef?.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    if (isAtBottom || force) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (currentTab === 'private_chat') {
      setTimeout(() => scrollToBottom(true, privateChatContainerRef), 30);
      if (activePrivateMember?.id) {
        setNotifications(prev => prev.map(n =>
          (n.type === 'dm' && (n.targetUser?.id === activePrivateMember.id || n.senderKey === `dm-${activePrivateMember.id}`))
            ? { ...n, read: true }
            : n
        ));
      }
    }
  }, [currentTab, activePrivateMember, privateMessages]);

  useEffect(() => {
    if (currentTab === 'room_chat') {
      setTimeout(() => scrollToBottom(false, roomChatContainerRef), 30);
      if (selectedGroup?.id) {
        setNotifications(prev => prev.map(n =>
          (n.type === 'group' && String(n.groupId) === String(selectedGroup.id))
            ? { ...n, read: true }
            : n
        ));
      }
    }
  }, [currentTab, selectedGroup, roomChatMessages]);

  const fetchGroupsFromSupabase = async () => {
    if (!user?.id) {
      setStudyGroups([]);
      setAllPendingRequests([]);
      setIsGroupsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('study_groups').select('*').order('created_at', { ascending: false });
      if (error) {
        setGroupsLoadError(error.message);
        return;
      }
      setGroupsLoadError('');
      if (data) {
        setStudyGroups(data);

        const userName = currentUser?.name;
        const userId = user?.id;
        if (userId && userName) {
          const { data: myMemberships } = await supabase.from('group_members').select('group_id').or(`user_id.eq.${userId},user_name.eq.${userName}`).eq('status', 'accepted');
          if (myMemberships) {
            const approvedIds = myMemberships.map(m => m.group_id);
            setMyJoinedGroupIds(prev => Array.from(new Set([...prev, ...approvedIds])));
          }
        }

        if (userId) {
          data.forEach(async (g) => {
            if (g?.id == null) return;
            const { data: lastMsgs } = await supabase.from('group_messages').select('*').eq('group_id', g.id).order('created_at', { ascending: false }).limit(1);
            if (lastMsgs && lastMsgs[0]) {
              const cleanText = lastMsgs[0].text?.startsWith('[IMAGE]:') ? '📷 [ส่งรูปภาพ]' : lastMsgs[0].text;
              setRecentGroupMessages(prev => ({
                ...prev,
                [g.id]: {
                  text: `${lastMsgs[0].sender_name}: ${cleanText}`,
                  time: formatTime(lastMsgs[0].created_at),
                  timestamp: new Date(lastMsgs[0].created_at).getTime()
                }
              }));
            }
          });
        }
      }
    } catch (error) {
      setGroupsLoadError(error?.message || 'เกิดข้อผิดพลาดขณะโหลดกลุ่มติว');
    } finally {
      setIsGroupsLoading(false);
    }
  };

  const syncMyGroupMembershipResults = async () => {
    if (!user?.id) return;

    const { data: memberships, error } = await supabase
      .from('group_members')
      .select('id,group_id,status,user_id,created_at')
      .eq('user_id', user.id);

    if (error || !Array.isArray(memberships)) return;

    const nextStatuses = new window.Map(
      memberships.map(member => [String(member.group_id), {
        status: member.status,
        memberId: member.id
      }])
    );
    const previousStatuses = groupMembershipStatusRef.current;
    const isFirstSync = previousStatuses.size === 0;

    for (const [groupId, nextState] of nextStatuses.entries()) {
      const previousState = previousStatuses.get(groupId);
      if (!isFirstSync && previousState?.status !== nextState.status &&
          (nextState.status === 'accepted' || nextState.status === 'rejected')) {
        const { data: group } = await supabase
          .from('study_groups')
          .select('id,title,subject,host_id,host_name,max_members,current_members,location,date_time')
          .eq('id', groupId)
          .maybeSingle();

        const wasAccepted = nextState.status === 'accepted';
        const senderKey = `group-result-${nextState.memberId}`;

        if (wasAccepted) {
          setMyJoinedGroupIds(prev => Array.from(new Set([...prev, groupId])));
        }

        setNotifications(prev => {
          if (prev.some(n => n.senderKey === senderKey)) return prev;
          return [{
            id: senderKey,
            senderKey,
            title: wasAccepted ? 'คำขอเข้ากลุ่มได้รับการอนุมัติ' : 'คำขอเข้ากลุ่มถูกปฏิเสธ',
            desc: wasAccepted
              ? `หัวหน้าห้องอนุมัติให้คุณเข้าร่วม "${group?.title || 'กลุ่มติว'}" แล้ว`
              : `หัวหน้าห้องปฏิเสธคำขอเข้าร่วม "${group?.title || 'กลุ่มติว'}"`,
            time: 'เมื่อสักครู่',
            read: false,
            type: 'group',
            groupId,
            groupObj: group || null,
            statusText: wasAccepted ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ',
            isHandled: true
          }, ...prev].slice(0, 15);
        });

        setHasUnreadNotification(true);
        showToast(
          senderKey,
          wasAccepted ? 'คำขอเข้ากลุ่มได้รับการอนุมัติ' : 'คำขอเข้ากลุ่มถูกปฏิเสธ',
          wasAccepted
            ? `คุณสามารถเข้าร่วม "${group?.title || 'กลุ่มติว'}" ได้แล้ว`
            : `คำขอเข้าร่วม "${group?.title || 'กลุ่มติว'}" ถูกปฏิเสธ`,
          {
            type: 'group',
            groupId,
            groupObj: group || null,
            statusText: wasAccepted ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ'
          }
        );
      }
    }

    groupMembershipStatusRef.current = nextStatuses;
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchGroupsFromSupabase();
    const groupsChannel = supabase.channel('public-study-groups-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_groups' }, fetchGroupsFromSupabase)
      .subscribe();
    return () => supabase.removeChannel(groupsChannel);
  }, [user?.id, currentUser.name]);

  const fetchAllPendingRequestsForHost = async () => {
    if (!user?.id) {
      setAllPendingRequests([]);
      setNotifications(prev => prev.filter(n => n.type !== 'join_request'));
      return;
    }

    // 2-step query (no nested joins): 1) pending group_members, 2) related study_groups/profiles
    const { data: pendingMembers, error: membersError } = await supabase
      .from('group_members')
      .select('*')
      .eq('status', 'pending');
    if (membersError) {
      console.error('Unable to load pending group requests:', membersError);
      return;
    }
    if (!pendingMembers?.length) {
      setAllPendingRequests([]);
      setNotifications(prev => prev.filter(n => n.type !== 'join_request'));
      return;
    }

    let hostedGroups = studyGroups.filter(group => isHost(group));
    if (!hostedGroups.length) {
      const orFilters = [`host_id.eq.${user.id}`];
      if (user.email) orFilters.push(`host_id.eq.${user.email}`);
      const { data: myGroups } = await supabase
        .from('study_groups')
        .select('id,title,host_id')
        .or(orFilters.join(','));
      if (myGroups?.length) hostedGroups = myGroups;
    }

    const hostedGroupIds = new Set(hostedGroups.map(group => String(group.id)));
    const pendingGroupIds = [...new Set(
      pendingMembers
        .map(member => member.group_id)
        .filter(groupId => groupId != null && hostedGroupIds.has(String(groupId)))
    )];
    if (!pendingGroupIds.length) {
      setAllPendingRequests([]);
      setNotifications(prev => prev.filter(n => n.type !== 'join_request'));
      return;
    }

    const { data: groups, error: groupsError } = await supabase
      .from('study_groups')
      .select('id,title,host_id')
      .in('id', pendingGroupIds);
    if (groupsError) {
      console.error('Unable to load groups for pending requests:', groupsError);
      return;
    }

    const groupById = new window.Map([...(hostedGroups || []), ...(groups || [])].map(group => [String(group.id), group]));
    const hostedPending = pendingMembers.filter(member => hostedGroupIds.has(String(member.group_id)));

    const pendingUserIds = [...new Set(hostedPending.map(member => member.user_id).filter(Boolean))];
    let profileById = new window.Map();
    if (pendingUserIds.length) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id,display_name,avatar,gender')
        .in('id', pendingUserIds);
      if (profiles) profileById = new window.Map(profiles.map(profile => [String(profile.id), profile]));
    }

    const pendingByUserAndGroup = new window.Map();
    hostedPending.forEach(member => {
      const key = `${String(member.group_id)}:${String(member.user_id)}`;
      const current = pendingByUserAndGroup.get(key);
      const memberTime = new Date(member.created_at || 0).getTime();
      const currentTime = new Date(current?.created_at || 0).getTime();
      if (!current || memberTime >= currentTime) pendingByUserAndGroup.set(key, member);
    });

    const validPending = Array.from(pendingByUserAndGroup.values()).map(member => {
      const profile = profileById.get(String(member.user_id));
      return {
        ...member,
        user_name: profile?.display_name || member.user_name,
        user_avatar: profile?.avatar || member.user_avatar,
        gender: profile?.gender || member.gender,
        study_groups: groupById.get(String(member.group_id)) || null
      };
    });

    setAllPendingRequests(validPending);
    setNotifications(prev => {
      const liveMemberIds = new Set(validPending.map(pm => String(pm.id)));
      let updated = prev.filter(n =>
        n.type !== 'join_request' ||
        liveMemberIds.has(String(n.memberReqId))
      );

      validPending.forEach(pm => {
        const senderKey = `group-req-${pm.id}`;
        const legacyKey = `join-req-${pm.id}`;
        if (!updated.some(n => n.senderKey === senderKey || n.senderKey === legacyKey || String(n.memberReqId) === String(pm.id))) {
          const groupTitle = pm.study_groups?.title || 'กลุ่มเรียน';
          updated.unshift({
            id: `group-req-${pm.id}`,
            senderKey,
            title: 'มีคำขอเข้าร่วมกลุ่ม',
            desc: `${pm.user_name || 'ผู้ใช้'} ขอเข้าร่วมกลุ่ม "${groupTitle}"`,
            time: formatTime(pm.created_at) || '',
            read: false,
            type: 'join_request',
            memberReqId: pm.id,
            groupId: pm.group_id,
            userName: pm.user_name,
            senderAvatar: pm.user_avatar || '',
            isHandled: false
          });
        }
      });
      return updated.slice(0, 15);
    });
  };

  // 💾 โหลดและบันทึกประวัติแจ้งเตือนลง LocalStorage ป้องกันหายเมื่อรีเฟรชหน้าเว็บ
  useEffect(() => {
    if (!user?.id) return;
    try {
      const saved = localStorage.getItem(`study_buddy_notifications_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          const hasUnread = parsed.some(n => !n.read && (n.type !== 'join_request' || !n.isHandled));
          setHasUnreadNotification(hasUnread);
        }
      }
    } catch (e) {
      console.warn('Failed to load notifications from localStorage:', e);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    try {
      localStorage.setItem(`study_buddy_notifications_${user.id}`, JSON.stringify(notifications));
      const hasUnread = notifications.some(n => !n.read && (n.type !== 'join_request' || !n.isHandled));
      setHasUnreadNotification(hasUnread);
    } catch (e) {
      console.warn('Failed to save notifications to localStorage:', e);
    }
  }, [notifications, user?.id]);

  useEffect(() => {
    fetchAllPendingRequestsForHost();
  }, [user?.id, user?.email, studyGroups]);

  const showToast = (senderKey, title, message, notificationMeta = {}) => {
    playNotificationSound();
    setToastNotification({ title, message, ...notificationMeta });
    setHasUnreadNotification(true);
    setNotifications(prev => {
      const existingIndex = prev.findIndex(n => n.senderKey === senderKey);
      let updatedList = [...prev];
      if (existingIndex !== -1) {
        updatedList[existingIndex] = {
          ...updatedList[existingIndex],
          ...notificationMeta,
          desc: message,
          time: 'เมื่อสักครู่',
          read: false
        };
      } else {
        updatedList = [{
          id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 6),
          senderKey,
          title,
          desc: message,
          time: 'เมื่อสักครู่',
          read: false,
          ...notificationMeta
        }, ...prev];
      }

      // จัดลำดับความสำคัญ (Priority): คำขอเข้ากลุ่มที่ยังไม่ตอบรับ > คำขอเป็นเพื่อนที่ยังไม่อ่าน > ข้อความที่ยังไม่อ่าน > รายการที่อ่านแล้ว
      const getPriorityScore = (item) => {
        if ((item.type === 'join_request' || item.type === 'group_request') && !item.isHandled) return 4;
        if (item.type === 'friend_request' && !item.isHandled && !item.read) return 3;
        if (!item.read) return 2;
        return 1;
      };
      updatedList.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

      return updatedList.slice(0, 15);
    });
    setTimeout(() => setToastNotification(null), 5000);
  };

  const syncProfileToSupabase = async (userData, profileData) => {
    if (!userData) return;
    await supabase.from('profiles').upsert({
      id: userData.id, email: userData.email, display_name: profileData.name,
      gender: profileData.gender, avatar: profileData.avatar, faculty, updated_at: new Date().toISOString()
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); fetchProfileFromSupabase(session.user); }
      else setUser(null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) { setUser(session.user); fetchProfileFromSupabase(session.user); }
      else setUser(null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchProfileFromSupabase = async (authUser) => {
    if (!authUser?.id) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
    if (data) {
      const name = cleanProfileName(data.display_name || authUser.email.split('@')[0]);
      setDisplayName(name); setSelectedGender(data.gender || 'ชาย'); setFaculty(data.faculty === 'นักศึกษา SPU' ? '' : data.faculty || '');
      const userObj = { name, gender: data.gender || 'ชาย', avatar: data.avatar || cartoonAvatars[0].url };
      setCurrentUser(userObj);
      localStorage.setItem('user_profile_avatar', userObj.avatar);
      localStorage.setItem('user_profile_gender', userObj.gender);
    } else {
      const defaultName = authUser.user_metadata?.full_name || authUser.email.split('@')[0];
      setDisplayName(defaultName);
      const userObj = { name: defaultName, gender: savedGender, avatar: savedAvatar || cartoonAvatars[0].url };
      setCurrentUser(userObj); syncProfileToSupabase(authUser, userObj);
    }
  };

  const fetchFriendStatus = async () => {
    if (!user?.id) return;

    // Pending received requests
    const { data: reqs, error: reqsError } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('receiver_id', user.id)
      .eq('status', 'pending');

    const pendingReceived = (!reqsError && reqs) ? reqs : [];
    setFriendRequests(pendingReceived);

    // Sync pending friend-request notifications with current DB state
    setNotifications(prev => {
      let updated = prev.filter(n => {
        if (n.type !== 'friend_request') return true;
        const rid = String(n.requestId ?? String(n.senderKey || '').replace('friend-req-', '').replace('freq-', ''));
        return pendingReceived.some(r => String(r.id) === rid);
      });
      pendingReceived.forEach(req => {
        const senderKey = `friend-req-${req.id}`;
        if (!updated.some(n => n.senderKey === senderKey || String(n.requestId) === String(req.id))) {
          updated.unshift({
            id: `freq-${req.id}`,
            senderKey,
            title: 'มีคำขอเป็นเพื่อนใหม่',
            desc: `${req.sender_name || 'ผู้ใช้'} ส่งคำขอมาเป็นเพื่อนกับคุณ`,
            time: formatTime(req.created_at) || '',
            read: false,
            type: 'friend_request',
            requestId: req.id
          });
        }
      });
      return updated.slice(0, 15);
    });

    // Pending sent requests
    const { data: sentReqs } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('sender_id', user.id)
      .eq('status', 'pending');
    setSentFriendRequests(sentReqs || []);

    // Friendship status is the source of truth; old messages must not restore a removed friend.
    const { data: acceptedReqs } = await supabase
      .from('friend_requests')
      .select('id,sender_id,receiver_id,status')
      .eq('status', 'accepted')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    const { data: dmRows } = await supabase
      .from('direct_messages')
      .select('id,sender_id,receiver_id,created_at,text')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(300);

    const partnerIdsSet = new Set();
    (acceptedReqs || []).forEach(r => {
      const otherId = String(r.sender_id) === String(user.id) ? r.receiver_id : r.sender_id;
      if (otherId && String(otherId) !== String(user.id)) partnerIdsSet.add(String(otherId));
      friendRequestPartnerRef.current.set(String(r.id), String(otherId));
    });

    const partnerIds = Array.from(partnerIdsSet);
    if (partnerIds.length === 0) {
      setAcceptedFriends([]);
      setRecentDMMessages({});
      setNotifications(prev => prev.filter(n => n.type !== 'dm'));
      if (activePrivateMember) {
        setActivePrivateMember(null);
        setPrivateMessages([]);
        setCurrentTab(current => current === 'private_chat' ? 'my_groups' : current);
      }
      return;
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', partnerIds);

    const profileById = new window.Map((profiles || []).map(p => [String(p.id), p]));
    const partners = partnerIds.map(id => profileById.get(String(id)) || { id });
    setAcceptedFriends(partners);
    if (activePrivateMember && !partnerIdsSet.has(String(activePrivateMember.id))) {
      setActivePrivateMember(null);
      setPrivateMessages([]);
      setCurrentTab(current => current === 'private_chat' ? 'my_groups' : current);
    }

    const latestByPartner = new window.Map();
    (dmRows || []).forEach(m => {
      const otherId = String(m.sender_id) === String(user.id) ? m.receiver_id : m.sender_id;
      const key = String(otherId);
      if (!key || key === String(user.id) || !partnerIdsSet.has(key)) return;
      if (!latestByPartner.has(key)) latestByPartner.set(key, m);
    });

    setRecentDMMessages(() => {
      const next = {};
      latestByPartner.forEach((last, pid) => {
        const isFromMe = String(last.sender_id) === String(user.id);
        const cleanText = last.text?.startsWith('[IMAGE]:') ? '[รูปภาพ]' : (last.text || '');
        const isAlreadyRead = readMessageIdsRef.current.has(last.id) || isFromMe;
        next[pid] = {
          text: isFromMe ? `คุณ: ${cleanText}` : cleanText,
          time: formatTime(last.created_at),
          unread: !isAlreadyRead && !isFromMe,
          timestamp: new Date(last.created_at).getTime() || Date.now()
        };
      });
      return next;
    });

    setNotifications(prev => {
      let updated = prev.filter(n => n.type !== 'dm' || partnerIdsSet.has(String(n.targetUser?.id)));
      latestByPartner.forEach((last, pid) => {
        const profile = profileById.get(String(pid)) || partners.find(p => String(p.id) === String(pid));
        const isFromMe = String(last.sender_id) === String(user.id);
        const cleanText = last.text?.startsWith('[IMAGE]:') ? '[รูปภาพ]' : (last.text || '');
        const isAlreadyRead = readMessageIdsRef.current.has(last.id) || isFromMe;
        const friendDisplayName = cleanProfileName(profile?.display_name || profile?.email?.split('@')[0] || 'ผู้ใช้');
        const senderKey = `dm-${pid}`;
        if (!isAlreadyRead) {
          if (!updated.some(n => n.senderKey === senderKey && !n.read)) {
            updated = [{
              id: `dm-${last.id}`,
              senderKey,
              title: `ข้อความจาก ${friendDisplayName}`,
              desc: cleanText,
              time: formatTime(last.created_at) || '',
              read: false,
              type: 'dm',
              targetUser: { id: pid, name: friendDisplayName, avatar: profile?.avatar || cartoonAvatars[0].url }
            }, ...updated.filter(n => n.senderKey !== senderKey)];
          }
        } else {
          updated = updated.map(n => n.senderKey === senderKey ? { ...n, read: true } : n);
        }
      });
      return updated.slice(0, 15);
    });
  };

  useEffect(() => { fetchFriendStatus(); }, [user]);

  const syncLatestGroupMessages = async () => {
    if (!user?.id) return;

    const { data: messages, error } = await supabase
      .from('group_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !Array.isArray(messages)) return;

    const latestByGroup = new window.Map();
    messages.forEach(message => {
      const groupId = String(message.group_id);
      if (!latestByGroup.has(groupId)) latestByGroup.set(groupId, message);
    });

    latestByGroup.forEach(message => {
      const senderId = message.user_id ?? message.sender_id;
      const isFromMe = (senderId != null && String(senderId) === String(user.id))
        || message.sender_name === currentUser.name;
      if (isFromMe) return;

      const messageId = String(message.id);
      if (readMessageIdsRef.current.has(messageId)) return;

      const inRoom = currentTab === 'room_chat'
        && String(selectedGroup?.id) === String(message.group_id);
      if (inRoom) {
        markMessageAsRead(messageId);
        return;
      }

      const senderName = message.sender_name || 'สมาชิก';
      const cleanText = message.text?.startsWith('[IMAGE]:')
        ? '[รูปภาพ]'
        : (message.text || '');
      const group = studyGroups.find(item => String(item.id) === String(message.group_id));
      const senderKey = `group-msg-${message.group_id}-${messageId}`;

      setRecentGroupMessages(prev => ({
        ...prev,
        [message.group_id]: {
          text: `${senderName}: ${cleanText}`,
          time: formatTime(message.created_at),
          unread: true,
          timestamp: new Date(message.created_at).getTime() || Date.now()
        }
      }));

      setNotifications(prev => {
        if (prev.some(notification => notification.senderKey === senderKey)) return prev;
        return [{
          id: senderKey,
          senderKey,
          title: `ข้อความใหม่ในกลุ่ม${group?.title ? ` "${group.title}"` : ''}`,
          desc: `${senderName}: ${cleanText}`,
          time: formatTime(message.created_at) || '',
          read: false,
          type: 'group',
          groupId: message.group_id,
          groupObj: group || null,
          senderAvatar: message.sender_avatar || '',
          senderName
        }, ...prev].slice(0, 15);
      });

      if (!fallbackGroupToastIdsRef.current.has(messageId)) {
        fallbackGroupToastIdsRef.current.add(messageId);
        showToast(
          senderKey,
          `ข้อความใหม่ในกลุ่ม${group?.title ? ` "${group.title}"` : ''}`,
          `${senderName}: ${cleanText}`,
          {
            type: 'group',
            groupId: message.group_id,
            groupObj: group || null,
            senderAvatar: message.sender_avatar || '',
            senderName
          }
        );
      }

      setHasUnreadNotification(true);
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    syncMyGroupMembershipResults();
    syncLatestGroupMessages();
    const friendSyncInterval = window.setInterval(() => {
      fetchFriendStatus();
      fetchAllPendingRequestsForHost();
      syncMyGroupMembershipResults();
      syncLatestGroupMessages();
    }, 5000);
    return () => window.clearInterval(friendSyncInterval);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || typeof window.BroadcastChannel !== 'function') return;

    const channel = new window.BroadcastChannel('study-buddy-friend-sync');
    friendSyncChannelRef.current = channel;

    channel.onmessage = (event) => {
      const payload = event.data;
      if (!payload?.type) return;

      if (payload.type === 'group_join_request') {
        if (!payload.groupHostId) return;
        const isTargetHost =
          String(payload.groupHostId) === String(user.id) ||
          (!!payload.groupHostEmail && payload.groupHostEmail === user.email);
        if (!isTargetHost) return;

        const senderKey = `group-req-${payload.memberId}`;
        showToast(
          senderKey,
          'มีคำขอเข้าร่วมกลุ่ม',
          `${payload.userName || 'ผู้ใช้'} ขอเข้าร่วมกลุ่ม "${payload.groupTitle || 'กลุ่มเรียน'}"`,
          {
            type: 'join_request',
            id: senderKey,
            memberReqId: payload.memberId,
            groupId: payload.groupId,
            userName: payload.userName,
            senderAvatar: payload.userAvatar || '',
            isHandled: false
          }
        );
        fetchAllPendingRequestsForHost();
      }

      if (payload.type === 'group_join_result') {
        if (String(payload.memberUserId) !== String(user.id)) return;
        const wasAccepted = payload.status === 'accepted';
        setMyJoinedGroupIds(prev => wasAccepted
          ? Array.from(new Set([...prev, payload.groupId]))
          : prev
        );
        setNotifications(prev => {
          const notification = {
            id: `group-result-${payload.memberId}`,
            senderKey: `group-result-${payload.memberId}`,
            title: wasAccepted ? 'คำขอเข้ากลุ่มได้รับการอนุมัติ' : 'คำขอเข้ากลุ่มถูกปฏิเสธ',
            desc: wasAccepted
              ? `หัวหน้าห้องอนุมัติให้คุณเข้าร่วม "${payload.groupTitle || 'กลุ่มติว'}" แล้ว`
              : `หัวหน้าห้องปฏิเสธคำขอเข้าร่วม "${payload.groupTitle || 'กลุ่มติว'}"`,
            time: 'เมื่อสักครู่',
            read: false,
            type: 'group',
            groupId: payload.groupId,
            groupObj: payload.groupObj || null,
            statusText: wasAccepted ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ',
            isHandled: true
          };
          return [notification, ...prev.filter(n =>
            n.senderKey !== notification.senderKey &&
            !(n.type === 'join_request' && String(n.memberReqId) === String(payload.memberId))
          )].slice(0, 15);
        });
        setHasUnreadNotification(true);
        showToast(
          `group-result-${payload.memberId}`,
          wasAccepted ? 'คำขอเข้ากลุ่มได้รับการอนุมัติ' : 'คำขอเข้ากลุ่มถูกปฏิเสธ',
          wasAccepted
            ? `คุณสามารถเข้าร่วม "${payload.groupTitle || 'กลุ่มติว'}" ได้แล้ว`
            : `คำขอเข้าร่วม "${payload.groupTitle || 'กลุ่มติว'}" ถูกปฏิเสธ`,
          {
            type: 'group',
            groupId: payload.groupId,
            groupObj: payload.groupObj || null,
            statusText: wasAccepted ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ'
          }
        );
        fetchGroupsFromSupabase();
      }

      if (payload.type === 'friend_request') {
        if (String(payload.receiverId) !== String(user.id)) return;
        const request = payload.request || {
          id: `pending-${payload.senderId}`,
          sender_id: payload.senderId,
          sender_name: payload.senderName,
          receiver_id: payload.receiverId,
          status: 'pending'
        };
        setFriendRequests(prev => {
          if (payload.request?.id && prev.some(item => String(item.id) === String(payload.request.id))) return prev;
          return [...prev, request];
        });
        showToast(
          `friend-req-${payload.request?.id || payload.senderId}`,
          'มีคำขอเป็นเพื่อนใหม่',
          `${payload.senderName || 'ผู้ใช้'} ส่งคำขอมาเป็นเพื่อนกับคุณ`,
          { type: 'friend_request', requestId: payload.request?.id }
        );
        fetchFriendStatus();
      }

      if (payload.type === 'friend_accepted') {
        if (String(payload.partnerId) === String(user.id)) return;
        setAcceptedFriends(prev => {
          if (prev.some(friend => String(friend.id) === String(payload.partnerId))) return prev;
          return [...prev, {
            id: payload.partnerId,
            display_name: payload.partnerName || 'เพื่อน',
            name: payload.partnerName || 'เพื่อน',
            avatar: payload.partnerAvatar || cartoonAvatars[0].url,
            gender: payload.partnerGender || ''
          }];
        });
        setFriendRequests(prev => prev.filter(r =>
          String(r.sender_id) !== String(payload.partnerId) &&
          String(r.receiver_id) !== String(payload.partnerId)
        ));
        setSentFriendRequests(prev => prev.filter(r =>
          String(r.sender_id) !== String(payload.partnerId) &&
          String(r.receiver_id) !== String(payload.partnerId)
        ));
        setNotifications(prev => prev.filter(n =>
          n.type !== 'friend_request' ||
          (String(n.requestId) !== String(payload.requestId) &&
            n.senderKey !== `friend-req-${payload.requestId}`)
        ));
        fetchFriendStatus();
      }

      if (payload.type === 'friend_removed') {
        if (String(payload.partnerId) === String(user.id)) return;
        setAcceptedFriends(prev => prev.filter(friend => String(friend.id) !== String(payload.partnerId)));
        setRecentDMMessages(prev => {
          const next = { ...prev };
          delete next[payload.partnerId];
          delete next[String(payload.partnerId)];
          return next;
        });
        setNotifications(prev => prev.filter(n =>
          !(n.type === 'dm' && String(n.targetUser?.id) === String(payload.partnerId))
        ));
        if (activePrivateMember && String(activePrivateMember.id) === String(payload.partnerId)) {
          setActivePrivateMember(null);
          setPrivateMessages([]);
          setCurrentTab('my_groups');
        }
        fetchFriendStatus();
      }

      if (payload.type === 'direct_message') {
        const message = payload.message;
        if (!message) return;
        if (String(message.sender_id) !== String(user.id) &&
            String(message.receiver_id) !== String(user.id)) return;
        const targetFriendId = String(message.sender_id) === String(user.id)
          ? message.receiver_id
          : message.sender_id;
        const cleanText = message.text?.startsWith('[IMAGE]:') ? '[รูปภาพ]' : (message.text || '');
        const isCurrentlyChatting = currentTab === 'private_chat' &&
          activePrivateMember?.id && String(activePrivateMember.id) === String(targetFriendId);

        setAcceptedFriends(prev => {
          if (prev.some(friend => String(friend.id) === String(targetFriendId))) return prev;
          return [...prev, {
            id: targetFriendId,
            display_name: String(message.sender_id) === String(user.id)
              ? (message.receiver_name || 'เพื่อน')
              : (message.sender_name || 'เพื่อน'),
            name: String(message.sender_id) === String(user.id)
              ? (message.receiver_name || 'เพื่อน')
              : (message.sender_name || 'เพื่อน'),
            avatar: cartoonAvatars[0].url
          }];
        });

        if (isCurrentlyChatting || String(message.sender_id) === String(user.id)) {
          markMessageAsRead(message.id);
          setPrivateMessages(prev => {
            if (prev.some(item => String(item.id) === String(message.id))) return prev;
            return [...prev, message];
          });
          setTimeout(() => scrollToBottom(true, privateChatContainerRef), 20);
        }

        setRecentDMMessages(prev => ({
          ...prev,
          [targetFriendId]: {
            text: String(message.sender_id) === String(user.id) ? `คุณ: ${cleanText}` : cleanText,
            time: formatTime(message.created_at),
            unread: !isCurrentlyChatting && String(message.sender_id) !== String(user.id),
            timestamp: new Date(message.created_at).getTime() || Date.now()
          }
        }));
      }
    };

    return () => {
      channel.close();
      friendSyncChannelRef.current = null;
    };
  }, [user?.id, currentTab, activePrivateMember]);

  // GLOBAL REALTIME HUB
  useEffect(() => {
    if (!user?.id) return;
    const globalChannel = supabase.channel(`global-app-realtime-hub-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `receiver_id=eq.${user.id}`
      }, async (payload) => {
        const newMsg = payload.new;
        const isFromMe = newMsg.sender_id === user.id;
        const targetFriendId = isFromMe ? newMsg.receiver_id : newMsg.sender_id;
        const partnerName = isFromMe
          ? (newMsg.receiver_name || 'เพื่อน')
          : (newMsg.sender_name || 'เพื่อน');
        setAcceptedFriends(prev => {
          if (prev.some(friend => String(friend.id) === String(targetFriendId))) return prev;
          return [...prev, {
            id: targetFriendId,
            display_name: partnerName,
            name: partnerName,
            avatar: cartoonAvatars[0].url
          }];
        });

        const cleanText = newMsg.text?.startsWith('[IMAGE]:') ? '📷 [ส่งรูปภาพ]' : newMsg.text;
        const isCurrentlyChatting = currentTab === 'private_chat' && activePrivateMember?.id === targetFriendId;

        if (isCurrentlyChatting || isFromMe) {
          markMessageAsRead(newMsg.id);
        }

        const shouldMarkUnread = !isFromMe && !isCurrentlyChatting && !readMessageIdsRef.current.has(newMsg.id);

        setRecentDMMessages(prev => ({
          ...prev,
          [targetFriendId]: {
            text: isFromMe ? `คุณ: ${cleanText}` : cleanText,
            time: formatTime(newMsg.created_at),
            unread: shouldMarkUnread,
            timestamp: new Date(newMsg.created_at).getTime() || Date.now()
          }
        }));

        if (shouldMarkUnread) {
          const realAvatar = newMsg.sender_avatar || cartoonAvatars[0].url;
          showToast(`dm-${newMsg.sender_id}`, `💬 ข้อความใหม่จาก ${newMsg.sender_name}`, cleanText, { type: 'dm', targetUser: { id: newMsg.sender_id, name: newMsg.sender_name, avatar: realAvatar } });
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'direct_messages' }, () => {
        fetchFriendStatus();
        setTimeout(fetchFriendStatus, 300);
        setTimeout(fetchFriendStatus, 1200);
      })

      .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests' }, (payload) => {
        fetchFriendStatus();
        const req = payload.new || payload.old;
        if (!req) return;
        if (payload.eventType === 'INSERT' && String(req.receiver_id) === String(user.id) && req.status === 'pending') {
          showToast(`friend-req-${req.id}`, 'มีคำขอเป็นเพื่อนใหม่', `${req.sender_name || 'ผู้ใช้'} ส่งคำขอมาเป็นเพื่อนกับคุณ`, { type: 'friend_request', requestId: req.id });
        } else if ((payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') && req.status === 'accepted' && (String(req.sender_id) === String(user.id) || String(req.receiver_id) === String(user.id))) {
          setFriendRequests(prev => prev.filter(r => String(r.id) !== String(req.id)));
          setSentFriendRequests(prev => prev.filter(r => String(r.id) !== String(req.id)));
          setNotifications(prev => prev.filter(n => !(n.type === 'friend_request' && (String(n.requestId) === String(req.id) || n.senderKey === `friend-req-${req.id}`))));
          const partnerId = String(req.sender_id) === String(user.id) ? req.receiver_id : req.sender_id;
          const partnerName = String(req.sender_id) === String(user.id)
            ? (req.receiver_name || 'เพื่อน')
            : (req.sender_name || 'เพื่อน');
          if (partnerId) {
            setAcceptedFriends(prev => {
              if (prev.some(friend => String(friend.id) === String(partnerId))) return prev;
              return [...prev, {
                id: partnerId,
                display_name: partnerName,
                name: partnerName,
                avatar: cartoonAvatars[0].url
              }];
            });
          }
          if (String(req.sender_id) === String(user.id)) {
            showToast(`friend-acc-${req.id}`, 'คำขอเป็นเพื่อนได้รับการยอมรับ', 'ตอนนี้คุณสามารถเริ่มแชทส่วนตัวได้แล้ว');
          }
          setTimeout(fetchFriendStatus, 300);
          setTimeout(fetchFriendStatus, 1200);
        } else if (payload.eventType === 'DELETE') {
          setFriendRequests(prev => prev.filter(r => String(r.id) !== String(req.id)));
          setSentFriendRequests(prev => prev.filter(r => String(r.id) !== String(req.id)));
          setNotifications(prev => prev.filter(n => !(n.type === 'friend_request' && (String(n.requestId) === String(req.id) || n.senderKey === `friend-req-${req.id}`))));
          const removedFriendId = req.sender_id && req.receiver_id
            ? (String(req.sender_id) === String(user.id) ? req.receiver_id : req.sender_id)
            : friendRequestPartnerRef.current.get(String(req.id));
          if (removedFriendId) {
            setAcceptedFriends(prev => prev.filter(f => String(f.id) !== String(removedFriendId)));
            friendRequestPartnerRef.current.delete(String(req.id));
            setRecentDMMessages(prev => {
              const next = { ...prev };
              delete next[removedFriendId];
              delete next[String(removedFriendId)];
              return next;
            });
            setNotifications(prev => prev.filter(n =>
              !(n.type === 'dm' && String(n.targetUser?.id) === String(removedFriendId))
            ));
            if (activePrivateMember && String(activePrivateMember.id) === String(removedFriendId)) {
              setActivePrivateMember(null);
              setPrivateMessages([]);
              setCurrentTab('my_groups');
            }
          }
          setTimeout(fetchFriendStatus, 300);
          setTimeout(fetchFriendStatus, 1200);
        }
      })

      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, async (payload) => {
        fetchAllPendingRequestsForHost();
        const m = payload.new;
        const currentUserId = user?.id;

        if (m && (String(m.user_id) === String(currentUserId) || m.user_name === currentUser.name)) {
          if (m.status === 'accepted') {
            setMyJoinedGroupIds(prev => Array.from(new Set([...prev, m.group_id])));
            groupMembershipStatusRef.current.set(String(m.group_id), {
              status: 'accepted',
              memberId: m.id
            });

            let approvedGroup = studyGroups.find(g => String(g.id) === String(m.group_id));
            if (!approvedGroup && m.group_id != null) {
              const { data: fetchedG } = await supabase.from('study_groups').select('*').eq('id', m.group_id).single();
              if (fetchedG) approvedGroup = fetchedG;
            }
            showToast(
              `approved-${m.group_id}`,
              'คำขอเข้าร่วมกลุ่มได้รับการอนุมัติ',
              `คุณสามารถเข้าร่วมกลุ่ม "${approvedGroup?.title || 'กลุ่มติว'}" ได้แล้ว`,
              { type: 'group', groupId: m.group_id, groupObj: approvedGroup || null }
            );
            setNotifications(prev => {
              const senderKey = `approved-${m.group_id}`;
              if (prev.some(n => n.senderKey === senderKey)) return prev;
              return [{
                id: senderKey,
                senderKey,
                title: 'คำขอเข้าร่วมกลุ่มได้รับการอนุมัติ',
                desc: `หัวหน้าห้องอนุมัติให้คุณเข้าร่วม "${approvedGroup?.title || 'กลุ่มติว'}" แล้ว`,
                time: 'เมื่อสักครู่',
                read: false,
                type: 'group',
                groupId: m.group_id,
                groupObj: approvedGroup || null,
                statusText: 'อนุมัติแล้ว',
                isHandled: true
              }, ...prev].slice(0, 15);
            });
            setHasUnreadNotification(true);
          } else if (m.status === 'rejected') {
            setMyJoinedGroupIds(prev => prev.filter(id => String(id) !== String(m.group_id)));
            groupMembershipStatusRef.current.set(String(m.group_id), {
              status: 'rejected',
              memberId: m.id
            });
            setNotifications(prev => {
              const senderKey = `group-rejected-${m.group_id}`;
              const notification = {
                id: senderKey,
                senderKey,
                title: 'คำขอเข้ากลุ่มถูกปฏิเสธ',
                desc: `หัวหน้าห้องปฏิเสธคำขอเข้าร่วมกลุ่มของคุณ`,
                time: 'เมื่อสักครู่',
                read: false,
                type: 'group',
                groupId: m.group_id,
                statusText: 'ถูกปฏิเสธ',
                isHandled: true
              };
              return [notification, ...prev.filter(n => n.senderKey !== senderKey)].slice(0, 15);
            });
            setHasUnreadNotification(true);
            showToast(
              `group-rejected-${m.group_id}`,
              'คำขอเข้ากลุ่มถูกปฏิเสธ',
              'หัวหน้าห้องปฏิเสธคำขอเข้าร่วมกลุ่มของคุณ',
              { type: 'group', groupId: m.group_id, statusText: 'ถูกปฏิเสธ' }
            );
          }
        }

        if (selectedGroup?.id != null) {
          supabase.from('group_members').select('*').eq('group_id', selectedGroup.id).then(({ data: members }) => {
            if (members) setGroupMembers(members);
          });
        }

        if (payload.eventType === 'INSERT' && m && m.status === 'pending' && m.group_id != null) {
          let tg = studyGroups.find(g => String(g.id) === String(m.group_id));
          if (!tg) {
            const { data: fetchedGroup } = await supabase.from('study_groups').select('id,title,host_id').eq('id', m.group_id).single();
            if (fetchedGroup) tg = fetchedGroup;
          }
          if (isHost(tg)) {
            showToast(`group-req-${m.id}`, 'มีคำขอเข้าร่วมกลุ่ม', `${m.user_name || 'ผู้ใช้'} ขอเข้าร่วมกลุ่ม "${tg?.title || ''}"`, {
              type: 'join_request',
              id: `group-req-${m.id}`,
              memberReqId: m.id,
              groupId: m.group_id,
              userName: m.user_name,
              senderAvatar: m.user_avatar || '',
              isHandled: false
            });
          }
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages' }, async (payload) => {
        const gMsg = payload.new;
        if (!gMsg) return;
        const inRoom = currentTab === 'room_chat' && String(selectedGroup?.id) === String(gMsg.group_id);
        const senderId = gMsg.user_id ?? gMsg.sender_id;
        const isFromMe = (senderId != null && String(senderId) === String(user.id)) || gMsg.sender_name === currentUser.name;
        const cleanText = gMsg.text?.startsWith('[IMAGE]:') ? '[รูปภาพ]' : (gMsg.text || '');
        let isMemberOfGroup = myJoinedGroupIds.some(id => String(id) === String(gMsg.group_id))
          || studyGroups.some(g => String(g.id) === String(gMsg.group_id) && isHost(g));

        if (!isMemberOfGroup && gMsg.group_id != null) {
          const { data: membership } = await supabase
            .from('group_members')
            .select('status')
            .eq('group_id', gMsg.group_id)
            .eq('user_id', user.id)
            .in('status', ['accepted'])
            .maybeSingle();
          isMemberOfGroup = !!membership;
        }

        const shouldMarkUnread = !isFromMe && !inRoom && isMemberOfGroup && !readMessageIdsRef.current.has(gMsg.id);

        if (isMemberOfGroup || inRoom || String(senderId) === String(user.id)) {
          setRecentGroupMessages(prev => ({
            ...prev,
            [gMsg.group_id]: {
              text: `${gMsg.sender_name}: ${cleanText}`,
              time: formatTime(gMsg.created_at),
              unread: inRoom ? false : !!(prev[gMsg.group_id]?.unread || shouldMarkUnread),
              timestamp: new Date(gMsg.created_at).getTime() || Date.now()
            }
          }));
        }

        if (shouldMarkUnread) {
          const tg = studyGroups.find(g => String(g.id) === String(gMsg.group_id));
          showToast(`group-msg-${gMsg.group_id}`, `ข้อความใหม่ในกลุ่ม${tg?.title ? ` "${tg.title}"` : ''}`, `${gMsg.sender_name}: ${cleanText}`, {
            type: 'group',
            id: `group-msg-${gMsg.group_id}`,
            groupId: gMsg.group_id,
            groupObj: tg,
            senderAvatar: gMsg.sender_avatar || '',
            senderName: gMsg.sender_name || ''
          });
        }
      })

      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        const updatedProfile = payload.new;
        if (!updatedProfile || !updatedProfile.id) return;
        // 1. If it's my own profile updated from another session/device
        if (user?.id && updatedProfile.id === user.id) {
          const freshAvatar = updatedProfile.avatar || cartoonAvatars[0].url;
          setCurrentUser(prev => ({
            ...prev,
            name: cleanProfileName(updatedProfile.display_name || prev.name),
            gender: updatedProfile.gender || prev.gender,
            avatar: freshAvatar
          }));
          try {
            localStorage.setItem('user_profile_avatar', freshAvatar);
            if (updatedProfile.gender) localStorage.setItem('user_profile_gender', updatedProfile.gender);
          } catch { }
        }

        // 2. Realtime sync to accepted friends (Chat List & Friends List)
        setAcceptedFriends(prev => prev.map(f => {
          if (f.id === updatedProfile.id) {
            return {
              ...f,
              ...updatedProfile,
              name: cleanProfileName(updatedProfile.display_name || f.name || f.email?.split('@')[0]),
              avatar: updatedProfile.avatar || f.avatar || cartoonAvatars[0].url
            };
          }
          return f;
        }));

        // 3. Update active private chat member in realtime if currently open
        setActivePrivateMember(prev => {
          if (prev && prev.id === updatedProfile.id) {
            return {
              ...prev,
              avatar: updatedProfile.avatar || prev.avatar,
              name: cleanProfileName(updatedProfile.display_name || prev.name)
            };
          }
          return prev;
        });

        // 4. Update searched friends list in realtime
        setSearchedFriends(prev => prev.map(f => {
          if (f.id === updatedProfile.id) {
            return {
              ...f,
              avatar: updatedProfile.avatar || f.avatar,
              name: cleanProfileName(updatedProfile.display_name || f.name)
            };
          }
          return f;
        }));

        // 5. Update group members list if in room chat
        setGroupMembers(prev => prev.map(m => {
          if (m.user_id === updatedProfile.id) {
            return {
              ...m,
              user_avatar: updatedProfile.avatar || m.user_avatar
            };
          }
          return m;
        }));
      }).subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          fetchFriendStatus();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          fetchFriendStatus();
        }
      });

    return () => supabase.removeChannel(globalChannel);
  }, [user, currentUser.name, currentTab, activePrivateMember, selectedGroup, studyGroups, myJoinedGroupIds]);

  // Realtime Friends Search
  const activeSearchQuery = friendSearchTerm || searchTerm;
  useEffect(() => {
    if (!activeSearchQuery.trim()) { setSearchedFriends([]); return; }
    const timer = setTimeout(async () => {
      setIsSearchingRealtime(true);
      const query = activeSearchQuery.trim();
      let { data, error } = await supabase.rpc('search_profiles', { search_term: query });

      if (error?.code === 'PGRST202') {
        ({ data, error } = await supabase
          .from('profiles')
          .select('id,display_name,email,avatar,faculty,gender')
          .ilike('display_name', `${query}%`)
          .limit(10));
      }

      if (error) {
        console.error('Unable to search profiles:', error);
        setSearchedFriends([]);
      } else if (data) {
        const normalizedQuery = query.trim().toLowerCase();
        setSearchedFriends(data
          .filter(p => p.id !== user?.id)
          .filter(p => cleanProfileName(p.display_name || p.full_name || p.name || '').trim().toLowerCase().startsWith(normalizedQuery))
          .map(p => ({
            id: p.id,
            name: cleanProfileName(p.display_name || p.full_name || p.name || p.email?.split('@')[0] || 'เพื่อน'),
            faculty: p.faculty || '',
            avatar: p.avatar || cartoonAvatars[0].url,
            email: p.email || '',
            gender: p.gender || ''
          })));
      }
      setIsSearchingRealtime(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [activeSearchQuery, user]);

  // ROOM CHAT REALTIME LISTENER
  useEffect(() => {
    if (!user?.id || !selectedGroup?.id || currentTab !== 'room_chat') return;
    setRecentGroupMessages(prev => ({ ...prev, [selectedGroup.id]: { ...prev[selectedGroup.id], unread: false } }));
    setNotifications(prev => prev.map(n =>
      (n.senderKey === `group-msg-${selectedGroup.id}` || n.senderKey === `group-${selectedGroup.id}` || (n.type === 'group' && String(n.groupId) === String(selectedGroup.id)))
        ? { ...n, read: true }
        : n
    ));
    setRoomChatMessages([]);
    setRoomChatLoadError('');
    setNewRoomMessageMarkerId(null);
    setNewRoomMessagesCount(0);
    unseenRoomMessageIdsRef.current.clear();
    roomChatAtBottomRef.current = true;

    const fetchGroupData = async () => {
      setIsRoomChatLoading(true);
      try {
        const { data: msgs, error: messagesError } = await supabase.from('group_messages').select('*').eq('group_id', selectedGroup.id).order('created_at', { ascending: true });
        if (messagesError) throw messagesError;
        const loadedMessages = msgs || [];
        loadedMessages.forEach(m => markMessageAsRead(m.id));
        setRoomChatMessages(loadedMessages);
        setTimeout(() => scrollToBottom(true, roomChatContainerRef), 20);

        const { data: members } = await supabase.from('group_members').select('*').eq('group_id', selectedGroup.id);
        if (members) setGroupMembers(members);
      } catch (error) {
        setRoomChatLoadError(error?.message || 'โหลดข้อความไม่สำเร็จ');
      } finally {
        setIsRoomChatLoading(false);
      }
    };

    fetchGroupData();

    const roomChannel = supabase.channel(`room-realtime-${selectedGroup.id}-${Date.now()}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${selectedGroup.id}`
      }, (payload) => {
        const newMsg = payload.new;
        if (String(newMsg.group_id) === String(selectedGroup.id)) {
          handleIncomingRoomMessage(newMsg);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, (payload) => {
        if (payload.new && String(payload.new.group_id) === String(selectedGroup.id)) {
          fetchGroupData();
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          fetchGroupData();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          fetchGroupData();
        }
      });

    return () => supabase.removeChannel(roomChannel);
  }, [selectedGroup?.id, currentTab, user?.id]);

  // PRIVATE CHAT REALTIME LISTENER
  useEffect(() => {
    if (!activePrivateMember?.id || !user?.id || currentTab !== 'private_chat') return;

    let isActive = true;
    setRecentDMMessages(prev => ({ ...prev, [activePrivateMember.id]: { ...prev[activePrivateMember.id], unread: false } }));

    const fetchDMs = async () => {
      const { data, error } = await supabase.from('direct_messages').select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activePrivateMember.id}),and(sender_id.eq.${activePrivateMember.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (!error && data && isActive) {
        data.forEach(m => markMessageAsRead(m.id));
        setPrivateMessages(data);
        setTimeout(() => scrollToBottom(true, privateChatContainerRef), 30);
      }
    };

    fetchDMs();

    const dmChannel = supabase.channel(`direct-messages-realtime-${user.id}-${activePrivateMember.id}-${Date.now()}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages'
      }, (payload) => {
        if (!isActive) return;
        const newMsg = payload.new;
        if ((newMsg.sender_id === user.id && newMsg.receiver_id === activePrivateMember.id) ||
          (newMsg.sender_id === activePrivateMember.id && newMsg.receiver_id === user.id)) {
          markMessageAsRead(newMsg.id);
          setPrivateMessages(prev => {
            if (prev.some(m => String(m.id) === String(newMsg.id))) return prev;
            return [...prev, newMsg];
          });
          setTimeout(() => scrollToBottom(true, privateChatContainerRef), 20);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          fetchDMs();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          fetchDMs();
        }
      });

    return () => {
      isActive = false;
      supabase.removeChannel(dmChannel);
    };
  }, [activePrivateMember, user, currentTab]);

  // Actions
  const handleSendFriendRequest = async (targetUser) => {
    if (!user?.id || !targetUser?.id) return;
    const { data, error } = await supabase.from('friend_requests').insert([{
      sender_id: user.id,
      sender_name: currentUser.name,
      receiver_id: targetUser.id,
      receiver_name: targetUser.name,
      status: 'pending'
    }]).select();
    if (error) notifyUser('ส่งคำขอเป็นเพื่อนไม่สำเร็จ: ' + error.message);
    else {
      notifyUser(`ส่งคำขอเป็นเพื่อนถึง ${targetUser.name || 'ผู้ใช้'} แล้ว`);
      setSentFriendRequests(prev => {
        if (prev.some(request => String(request.receiver_id) === String(targetUser.id))) return prev;
        return [...prev, data?.[0] || {
          sender_id: user.id,
          sender_name: currentUser.name,
          receiver_id: targetUser.id,
          receiver_name: targetUser.name,
          status: 'pending'
        }];
      });
      friendSyncChannelRef.current?.postMessage({
        type: 'friend_request',
        request: data?.[0] || null,
        receiverId: targetUser.id,
        senderId: user.id,
        senderName: currentUser.name
      });
      fetchFriendStatus();
    }
  };

  const handleAcceptFriendRequest = async (request) => {
    if (request?.id == null) return;
    const { error } = await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', request.id);
    if (!error) {
      notifyUser(`ตอบรับคำขอจาก ${request.sender_name || 'เพื่อน'} เรียบร้อยแล้ว!`);
      setFriendRequests(prev => prev.filter(r => r.id !== request.id));
      if (request.sender_id) {
        setAcceptedFriends(prev => {
          if (prev.some(friend => String(friend.id) === String(request.sender_id))) return prev;
          return [...prev, {
            id: request.sender_id,
            display_name: request.sender_name || 'เพื่อน',
            name: request.sender_name || 'เพื่อน',
            avatar: cartoonAvatars[0].url
          }];
        });
        friendSyncChannelRef.current?.postMessage({
          type: 'friend_accepted',
          requestId: request.id,
          partnerId: request.sender_id,
          partnerName: request.sender_name || 'เพื่อน',
          partnerAvatar: cartoonAvatars[0].url
        });
      }
      setNotifications(prev => prev.map(n => {
        if (n.type === 'friend_request' && (n.requestId === request.id || n.senderKey === `friend-req-${request.id}`)) {
          return { ...n, isHandled: true, read: true, statusText: 'เป็นเพื่อนกันแล้ว' };
        }
        return n;
      }));
      fetchFriendStatus();
      setTimeout(fetchFriendStatus, 300);
      setTimeout(fetchFriendStatus, 1200);
    } else {
      notifyUser('ทำรายการไม่สำเร็จ: ' + error.message);
    }
  };

  const handleRejectFriendRequest = async (requestOrId) => {
    const requestId = typeof requestOrId === 'object' && requestOrId !== null ? requestOrId.id : requestOrId;
    if (requestId == null) return;
    const { error } = await supabase.from('friend_requests').delete().eq('id', requestId);
    if (!error) {
      notifyUser('ปฏิเสธคำขอเป็นเพื่อนแล้ว');
      setFriendRequests(prev => prev.filter(r => String(r.id) !== String(requestId)));
      setNotifications(prev => prev.filter(n => !(n.type === 'friend_request' && (String(n.requestId) === String(requestId) || n.senderKey === `friend-req-${requestId}`))));
      fetchFriendStatus();
    } else {
      const { error: updateError } = await supabase.from('friend_requests').update({ status: 'rejected' }).eq('id', requestId);
      if (!updateError) {
        notifyUser('ปฏิเสธคำขอเป็นเพื่อนแล้ว');
        setFriendRequests(prev => prev.filter(r => String(r.id) !== String(requestId)));
        setNotifications(prev => prev.filter(n => !(n.type === 'friend_request' && (String(n.requestId) === String(requestId) || n.senderKey === `friend-req-${requestId}`))));
        fetchFriendStatus();
      } else {
        notifyUser('ทำรายการไม่สำเร็จ: ' + error.message);
      }
    }
  };

  const handleCancelFriendRequest = async (targetUserId) => {
    if (!user?.id || !targetUserId) return;
    const { error } = await supabase.from('friend_requests').delete()
      .eq('sender_id', user.id)
      .eq('receiver_id', targetUserId)
      .eq('status', 'pending');
    if (!error) {
      notifyUser('ยกเลิกคำขอเป็นเพื่อนแล้ว');
      setSentFriendRequests(prev => prev.filter(r => r.receiver_id !== targetUserId));
      fetchFriendStatus();
    } else {
      const { error: updateError } = await supabase.from('friend_requests').update({ status: 'cancelled' })
        .eq('sender_id', user.id)
        .eq('receiver_id', targetUserId)
        .eq('status', 'pending');
      if (!updateError) {
        notifyUser('ยกเลิกคำขอเป็นเพื่อนแล้ว');
        setSentFriendRequests(prev => prev.filter(r => r.receiver_id !== targetUserId));
        fetchFriendStatus();
      } else {
        notifyUser('ยกเลิกคำขอไม่สำเร็จ: ' + error.message);
      }
    }
  };

  const handleUnfriend = async (friendUserId) => {
    if (!user?.id || !friendUserId) return;
    if (!window.confirm('ต้องการลบเพื่อนคนนี้ออกจากรายชื่อเพื่อนใช่ไหม?')) return;
    const { error } = await supabase.rpc('unfriend_user', { target_user_id: String(friendUserId) });
    if (error) {
      notifyUser('ไม่สามารถลบเพื่อนและประวัติแชตได้: ' + error.message, 'error');
      return;
    }
    setAcceptedFriends(prev => prev.filter(f => String(f.id) !== String(friendUserId)));
    setFriendRequests(prev => prev.filter(r => String(r.sender_id) !== String(friendUserId) && String(r.receiver_id) !== String(friendUserId)));
    setSentFriendRequests(prev => prev.filter(r => String(r.sender_id) !== String(friendUserId) && String(r.receiver_id) !== String(friendUserId)));
    setRecentDMMessages(prev => {
      const next = { ...prev };
      delete next[friendUserId];
      delete next[String(friendUserId)];
      return next;
    });
    setNotifications(prev => prev.filter(n => !(n.type === 'dm' && String(n.targetUser?.id) === String(friendUserId))));
    friendSyncChannelRef.current?.postMessage({
      type: 'friend_removed',
      partnerId: friendUserId
    });
    if (activePrivateMember && String(activePrivateMember.id) === String(friendUserId)) {
      setActivePrivateMember(null);
      setPrivateMessages([]);
      setCurrentTab('my_groups');
    }
    notifyUser('ลบเพื่อนเรียบร้อยแล้ว');
    fetchFriendStatus();
    setTimeout(fetchFriendStatus, 300);
    setTimeout(fetchFriendStatus, 1200);
  };

  const handleSendPrivateMsg = async (attachedImage = null) => {
    const textToSend = attachedImage || privateMsgInput.trim();
    if (!textToSend || !activePrivateMember?.id || !user) return;
    const textBeforeSend = privateMsgInput;
    if (!attachedImage) setPrivateMsgInput('');
    setAcceptedFriends(prev => {
      if (prev.some(friend => String(friend.id) === String(activePrivateMember.id))) return prev;
      return [...prev, {
        id: activePrivateMember.id,
        display_name: activePrivateMember.name,
        name: activePrivateMember.name,
        avatar: activePrivateMember.avatar || cartoonAvatars[0].url,
        gender: activePrivateMember.gender || ''
      }];
    });

    const { data, error } = await supabase.from('direct_messages').insert([{
      sender_id: user.id,
      sender_name: currentUser.name,
      receiver_id: activePrivateMember.id,
      receiver_name: activePrivateMember.name,
      text: textToSend
    }]).select();

    if (!error && data?.[0]) {
      markMessageAsRead(data[0].id);
      setPrivateMessages(prev => [...prev, data[0]]);
      friendSyncChannelRef.current?.postMessage({
        type: 'direct_message',
        message: data[0]
      });
      setTimeout(() => scrollToBottom(true, privateChatContainerRef), 10);
      const cleanText = attachedImage ? '📷 [ส่งรูปภาพ]' : textToSend;
      setRecentDMMessages(prev => ({
        ...prev,
        [activePrivateMember.id]: {
          text: `คุณ: ${cleanText}`,
          time: 'เมื่อสักครู่',
          unread: false,
          timestamp: Date.now()
        }
      }));
    } else if (error) {
      if (!attachedImage) setPrivateMsgInput(textBeforeSend);
      notifyUser('ส่งข้อความส่วนตัวไม่สำเร็จ: ' + error.message, 'error');
    }
  };

  const handleSendRoomMsg = async (attachedImage = null) => {
    const textToSend = attachedImage || roomChatMsg.trim();
    if (!textToSend || !selectedGroup) return;

    if (!user?.id) {
      notifyUser('กรุณาเข้าสู่ระบบก่อนส่งข้อความ');
      return;
    }

    if (!isApprovedMember(selectedGroup)) {
      notifyUser('คุณต้องได้รับการอนุมัติจากหัวหน้าห้องก่อนจึงจะส่งข้อความได้ครับ');
      return;
    }

    setIsRoomSendAnimating(true);
    window.setTimeout(() => setIsRoomSendAnimating(false), 500);
    if (!attachedImage) setRoomChatMsg('');

    const { data, error } = await supabase.from('group_messages').insert([{
      group_id: selectedGroup.id,
      user_id: user.id,
      sender_name: currentUser.name,
      sender_avatar: currentUser.avatar,
      text: textToSend
    }]).select();

    if (!error && data?.[0]) {
      markMessageAsRead(data[0].id);
      setRoomChatMessages(prev => prev.some(message => String(message.id) === String(data[0].id)) ? prev : [...prev, data[0]]);
      const sentMessageId = String(data[0].id);
      setAnimatedRoomMessageId(sentMessageId);
      window.setTimeout(() => {
        setAnimatedRoomMessageId(currentId => currentId === sentMessageId ? null : currentId);
      }, 650);
      setTimeout(() => scrollToBottom(true, roomChatContainerRef), 10);
      const cleanText = attachedImage ? '📷 [ส่งรูปภาพ]' : textToSend;
      setRecentGroupMessages(prev => ({
        ...prev,
        [selectedGroup.id]: {
          text: `คุณ: ${cleanText}`,
          time: 'เมื่อสักครู่',
          unread: false,
          timestamp: Date.now()
        }
      }));
    } else if (error) {
      notifyUser('ส่งข้อความไม่สำเร็จ: ' + error.message);
    }
  };

  const handleChatFileUpload = async (e, isPrivate = false) => {
    const file = e.target.files[0]; if (!file) return;

    try {
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
      const { data: storageData, error: uploadErr } = await supabase.storage.from('chat-images').upload(fileName, file);

      if (!uploadErr && storageData) {
        const { data: urlData } = supabase.storage.from('chat-images').getPublicUrl(fileName);
        const imagePayload = `[IMAGE]:${urlData.publicUrl}`;
        if (isPrivate) handleSendPrivateMsg(imagePayload);
        else handleSendRoomMsg(imagePayload);
        return;
      }
    } catch (err) {
      console.log('Storage not configured, falling back to Canvas Base64');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height, MAX = 300;
        if (width > height ? width > MAX : height > MAX) {
          if (width > height) { height *= MAX / width; width = MAX; }
          else { width *= MAX / height; height = MAX; }
        }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        const imagePayload = `[IMAGE]:${compressedBase64}`;
        if (isPrivate) handleSendPrivateMsg(imagePayload);
        else handleSendRoomMsg(imagePayload);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRequestJoinRoom = async (group) => {
    if (group?.id == null) return;
    if (!user?.id) {
      notifyUser('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    setSelectedGroup(group);
    const userId = user.id;

    if (isHost(group)) {
      setMyJoinedGroupIds(prev => Array.from(new Set([...prev, group.id])));
      setCurrentTab('room_chat');
      return;
    }

    if (Number(group.current_members || 0) >= Number(group.max_members || 5)) {
      notifyUser('กลุ่มนี้เต็มแล้ว ไม่สามารถขอเข้าร่วมได้');
      return;
    }

    const { data: existing, error: lookupError } = await supabase.from('group_members')
      .select('*')
      .eq('group_id', group.id)
      .eq('user_id', userId);

    if (lookupError) {
      notifyUser('ตรวจสอบสถานะการเข้าร่วมกลุ่มไม่สำเร็จ: ' + lookupError.message);
      return;
    }

    if (!existing || existing.length === 0) {
      const { data: insertedRequests, error } = await supabase.from('group_members').insert([{
        group_id: group.id,
        user_id: userId,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar,
        status: 'pending'
      }]).select();
      if (error) {
        notifyUser('ส่งคำขอเข้าร่วมกลุ่มไม่สำเร็จ: ' + error.message);
      } else {
        notifyUser('ส่งคำขอเข้าร่วมกลุ่มเรียบร้อยแล้ว รอการอนุมัติจากหัวหน้ากลุ่ม');
        const insertedRequest = insertedRequests?.[0];
        if (insertedRequest?.id) {
          groupMembershipStatusRef.current.set(String(group.id), {
            status: 'pending',
            memberId: insertedRequest.id
          });
        }
        friendSyncChannelRef.current?.postMessage({
          type: 'group_join_request',
          memberId: insertedRequest?.id,
          groupId: group.id,
          groupTitle: group.title,
          groupHostId: group.host_id,
          groupHostEmail: group.host_email || null,
          userName: currentUser.name,
          userAvatar: currentUser.avatar
        });
        setTimeout(fetchAllPendingRequestsForHost, 300);
        setTimeout(fetchAllPendingRequestsForHost, 1200);
      }
    } else {
      const myMember = existing[0];
      if (myMember.status === 'accepted') {
        setMyJoinedGroupIds(prev => Array.from(new Set([...prev, group.id])));
        setCurrentTab('room_chat');
      } else if (myMember.status === 'pending') {
        notifyUser('คำขอของคุณกำลังรอการอนุมัติจากหัวหน้ากลุ่ม');
      } else if (myMember.status === 'rejected') {
        const { error: reapplyError } = await supabase
          .from('group_members')
          .update({
            status: 'pending',
            user_name: currentUser.name,
            user_avatar: currentUser.avatar
          })
          .eq('id', myMember.id);

        if (reapplyError) {
          notifyUser('ส่งคำขอเข้าร่วมกลุ่มไม่สำเร็จ: ' + reapplyError.message);
        } else {
          notifyUser('ส่งคำขอเข้าร่วมกลุ่มใหม่เรียบร้อยแล้ว รอการอนุมัติจากหัวหน้ากลุ่ม');
          groupMembershipStatusRef.current.set(String(group.id), {
            status: 'pending',
            memberId: myMember.id
          });
        }
      } else {
        notifyUser('ไม่สามารถเข้าร่วมกลุ่มนี้ได้ในขณะนี้');
      }
    }
  };

  const handleLeaveGroup = async (group = selectedGroup) => {
    if (group?.id == null) return;
    if (!user?.id) {
      notifyUser('กรุณาเข้าสู่ระบบก่อนออกจากกลุ่ม');
      return;
    }
    if (confirm(`ต้องการออกจากกลุ่ม "${group.title}" ใช่หรือไม่?`)) {
      const { data, error } = await supabase.from('group_members')
        .delete()
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .select('id');
      if (error || !data?.length) {
        notifyUser(error ? 'ออกจากกลุ่มไม่สำเร็จ: ' + error.message : 'ไม่พบสถานะสมาชิกในกลุ่มนี้');
        return;
      }
      notifyUser('ออกจากกลุ่มเรียบร้อยแล้ว');
      setMyJoinedGroupIds(prev => prev.filter(id => String(id) !== String(group.id)));

      const { data: acceptedList } = await supabase.from('group_members').select('*').eq('group_id', group.id).eq('status', 'accepted');
      const newCount = (acceptedList ? acceptedList.length : 0) + 1;
      await supabase.from('study_groups').update({ current_members: newCount }).eq('id', group.id);
      setStudyGroups(prev => prev.map(g => String(g.id) === String(group.id) ? { ...g, current_members: newCount } : g));

      if (String(selectedGroup?.id) === String(group.id)) {
        setSelectedGroup(null);
        setCurrentTab('home');
      } else {
        setSelectedGroup(prev => prev && String(prev.id) === String(group.id) ? { ...prev, current_members: newCount } : prev);
      }
      fetchGroupsFromSupabase();
    }
  };

  const handleApproveMember = async (memberId, status, notifId = null) => {
    if (memberId == null || !['accepted', 'rejected'].includes(status)) return;
    const pendingReq = allPendingRequests.find(req => String(req.id) === String(memberId))
      || (notifId ? notifications.find(n => String(n.id) === String(notifId) || String(n.memberReqId) === String(memberId)) : null)
      || notifications.find(n => String(n.memberReqId) === String(memberId));
    const targetMemberUserId = pendingReq?.user_id
      || groupMembers.find(m => String(m.id) === String(memberId))?.user_id
      || null;
    const targetMemberName = pendingReq?.user_name
      || groupMembers.find(m => String(m.id) === String(memberId))?.user_name
      || 'สมาชิก';
    const targetGroupId = pendingReq?.group_id
      || groupMembers.find(m => String(m.id) === String(memberId))?.group_id
      || selectedGroup?.id
      || null;

    const { error } = await supabase.from('group_members').update({ status }).eq('id', memberId);
    if (!error) {
      notifyUser(status === 'accepted' ? 'อนุมัติสมาชิกเรียบร้อยแล้ว' : 'ปฏิเสธคำขอเรียบร้อยแล้ว');
      setGroupMembers(prev => prev.map(m => String(m.id) === String(memberId) ? { ...m, status } : m));
      setAllPendingRequests(prev => prev.filter(req => String(req.id) !== String(memberId)));

      setNotifications(prev => prev.filter(n => !(
        String(n.memberReqId) === String(memberId)
        || String(n.id) === String(notifId)
        || n.senderKey === `group-req-${memberId}`
        || n.senderKey === `join-req-${memberId}`
      )));

      if (toastNotification && String(toastNotification.memberReqId) === String(memberId)) {
        setToastNotification(null);
      }

      if (targetGroupId != null) {
        const targetGroup = studyGroups.find(group => String(group.id) === String(targetGroupId))
          || (selectedGroup?.id && String(selectedGroup.id) === String(targetGroupId) ? selectedGroup : null);
        friendSyncChannelRef.current?.postMessage({
          type: 'group_join_result',
          memberId,
          memberUserId: targetMemberUserId,
          memberName: targetMemberName,
          status,
          groupId: targetGroupId,
          groupTitle: targetGroup?.title || pendingReq?.study_groups?.title || 'กลุ่มติว',
          groupObj: targetGroup || pendingReq?.study_groups || null
        });
        if (status === 'accepted') {
          const { data: acceptedList } = await supabase.from('group_members').select('*').eq('group_id', targetGroupId).eq('status', 'accepted');
          const newCount = (acceptedList ? acceptedList.length : 0) + 1;
          await supabase.from('study_groups').update({ current_members: newCount }).eq('id', targetGroupId);
          setSelectedGroup(prev => prev && String(prev.id) === String(targetGroupId) ? { ...prev, current_members: newCount } : prev);
          setStudyGroups(prev => prev.map(g => String(g.id) === String(targetGroupId) ? { ...g, current_members: newCount } : g));
        }
        if (selectedGroup?.id != null && String(selectedGroup.id) === String(targetGroupId)) {
          const { data: members } = await supabase.from('group_members').select('*').eq('group_id', targetGroupId);
          if (members) setGroupMembers(members);
        }
      }
      fetchAllPendingRequestsForHost();
    } else {
      notifyUser('อัปเดตคำขอไม่สำเร็จ: ' + error.message);
    }
  };
  const handleDeleteGroup = async () => {
    if (selectedGroup?.id == null) return;
    if (!isHost(selectedGroup)) { notifyUser('เฉพาะหัวหน้าห้องเท่านั้นที่มีสิทธิ์ยุบและลบกลุ่มนี้!'); return; }
    if (confirm(`⚠️ ยืนยันยุบห้องติว "${selectedGroup.title}" หรือไม่? \nข้อความและสมาชิกทั้งหมดในห้องนี้จะถูกลบทันที`)) {
      await supabase.from('group_members').delete().eq('group_id', selectedGroup.id);
      await supabase.from('group_messages').delete().eq('group_id', selectedGroup.id);
      const { error } = await supabase.from('study_groups').delete().eq('id', selectedGroup.id);

      if (!error) {
        notifyUser('ยุบและลบห้องติวเรียบร้อยแล้ว!');
        setShowMemberListModal(false);
        setSelectedGroup(null);
        await fetchGroupsFromSupabase();
        setCurrentTab('home');
      } else {
        notifyUser('ลบห้องไม่สำเร็จ: ' + error.message);
      }
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) { notifyUser('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วนครับ'); return; }
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) notifyUser('เข้าสู่ระบบไม่สำเร็จ: ' + error.message);
        else notifyUser('เข้าสู่ระบบสำเร็จแล้ว!');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: displayName || email.split('@')[0] } } });
        if (error) notifyUser('สมัครสมาชิกไม่สำเร็จ: ' + error.message);
        else {
          notifyUser('สมัครสมาชิกสำเร็จแล้ว!');
          if (data?.user) {
            const userObj = { name: displayName || email.split('@')[0], gender: selectedGender, avatar: cartoonAvatars[0].url };
            const { error: profileError } = await supabase.from('profiles').upsert({ id: data.user.id, email: data.user.email, display_name: userObj.name, gender: userObj.gender, avatar: userObj.avatar, faculty, updated_at: new Date().toISOString() });
            if (profileError) console.error('Unable to save the new user profile:', profileError);
            setCurrentUser(userObj);
          }
        }
      }
    } catch (error) {
      console.error('Supabase authentication request failed:', error);
      const message = error instanceof TypeError || error?.message === 'Failed to fetch'
        ? 'ติดต่อ Supabase ไม่ได้ (Failed to fetch) กรุณาตรวจอินเทอร์เน็ตและการตั้งค่า URL ของ Supabase'
        : error.message;
      notifyUser(`${authMode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}ไม่สำเร็จ: ${message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) notifyUser('เข้าสู่ระบบด้วย Google ไม่สำเร็จ: ' + error.message);
    } catch (error) {
      console.error('Google authentication request failed:', error);
      const message = error instanceof TypeError || error?.message === 'Failed to fetch'
        ? 'ติดต่อ Supabase ไม่ได้ กรุณาตรวจอินเทอร์เน็ตและการตั้งค่า URL ของ Supabase'
        : error.message;
      notifyUser('เข้าสู่ระบบด้วย Google ไม่สำเร็จ: ' + message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      notifyUser('ออกจากระบบไม่สำเร็จ: ' + error.message);
      return;
    }
    setUser(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
  };
  const handleOpenNotifications = () => { setShowNotificationModal(true); setHasUnreadNotification(false); };

  const handleNotificationClick = (n) => {
    if ((n.type === 'join_request' || n.type === 'group_request') && !n.isHandled) return;
    setShowNotificationModal(false);
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
    if (n.type === 'dm' && n.targetUser) {
      handleOpenPrivateChat(n.targetUser);
    } else if (n.type === 'friend_request') {
      setShowQuickFriendModal(true);
    } else if (n.type === 'group' || n.type === 'join_request') {
      const gToEnter = n.groupObj || studyGroups.find(g => String(g.id) === String(n.groupId));
      if (gToEnter) handleRequestJoinRoom(gToEnter);
    } else {
      setCurrentTab('my_groups');
    }
  };

  const handleSaveProfile = () => {
    if (!displayName.trim()) return;
    const finalName = cleanProfileName(displayName);
    setDisplayName(finalName);
    const updatedUser = { ...currentUser, name: finalName, gender: selectedGender };
    setCurrentUser(updatedUser); localStorage.setItem('user_profile_gender', selectedGender); setIsSavedProfile(true);
    if (user) syncProfileToSupabase(user, updatedUser);
    setTimeout(() => setIsSavedProfile(false), 2000);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender); localStorage.setItem('user_profile_gender', gender);
    const updatedUser = { ...currentUser, gender }; setCurrentUser(updatedUser);
    if (user) syncProfileToSupabase(user, updatedUser);
  };

  const saveAvatar = async (avatar) => {
    setCurrentUser(prev => ({ ...prev, avatar }));

    let localSaveFailed = false;
    try {
      localStorage.setItem('user_profile_avatar', avatar);
    } catch {
      localSaveFailed = true;
    }

    if (user?.id) {
      // 1. บันทึกลง Database จริง (Supabase profiles table) แบบ upsert ทันที
      const { error: profileError } = await supabase.from('profiles')
        .upsert({
          id: user.id,
          avatar,
          email: user.email,
          display_name: cleanProfileName(displayName || currentUser.name),
          gender: selectedGender || currentUser.gender,
          faculty,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Save avatar profile error:', profileError);
        notifyUser(`เปลี่ยนรูปในหน้านี้แล้ว แต่บันทึกลงบัญชีไม่สำเร็จ: ${profileError.message}`, 'error');
        return;
      }

      // 2. อัปเดตตาราง group_members ให้รูปสมาชิกในห้องติวเป็นรูปปัจจุบัน
      try {
        await supabase.from('group_members')
          .update({ user_avatar: avatar })
          .eq('user_id', user.id);
      } catch (memberErr) {
        console.log('Update group_members avatar non-fatal:', memberErr);
      }
    }

    if (localSaveFailed) {
      notifyUser(user
        ? 'อัปเดตรูปในบัญชีแล้ว แต่บันทึกลงอุปกรณ์นี้ไม่สำเร็จ'
        : 'เปลี่ยนรูปแล้ว แต่บันทึกลงอุปกรณ์นี้ไม่สำเร็จ', 'error');
    } else if (user) {
      notifyUser('เปลี่ยนรูปโปรไฟล์เรียบร้อยแล้ว!');
    } else {
      notifyUser('เปลี่ยนรูปแล้ว รูปนี้บันทึกไว้เฉพาะอุปกรณ์นี้ เนื่องจากยังไม่ได้เข้าสู่ระบบ');
    }
  };

  const handleSelectAvatar = (url) => saveAvatar(url);

  const handleFileUpload = (e) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (file.type && !file.type.startsWith('image/')) {
      notifyUser('กรุณาเลือกไฟล์รูปภาพ (เช่น JPG, PNG, WebP)', 'error');
      return;
    }

    // ปรับขยายขนาดไฟล์สูงสุดเป็น 50 MB เพื่อรองรับรูปถ่ายความละเอียดสูงจากกล้องมือถือรุ่นใหม่
    if (file.size > 50 * 1024 * 1024) {
      notifyUser('รูปมีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ไม่เกิน 50 MB', 'error');
      return;
    }

    notifyUser('กำลังประมวลผลรูปภาพ...', 'info');

    const processImage = (imgSrc, isObjectUrl = false) => {
      const img = new Image();
      img.onerror = () => {
        if (isObjectUrl) URL.revokeObjectURL(imgSrc);
        notifyUser('ไฟล์นี้ไม่สามารถเปิดเป็นรูปภาพได้ กรุณาลองเลือกรูปอื่น', 'error');
      };
      img.onload = async () => {
        try {
          if (isObjectUrl) URL.revokeObjectURL(imgSrc);
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 400; // ปรับขนาด avatar คมชัดพอดี
          if (width > height ? width > maxDimension : height > maxDimension) {
            if (width > height) {
              height *= maxDimension / width;
              width = maxDimension;
            } else {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }
          canvas.width = Math.round(width);
          canvas.height = Math.round(height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('ไม่สามารถประมวลผลรูปภาพได้');
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

          // อัปโหลดขึ้น Supabase Storage (หากล็อกอินอยู่) พร้อมต่อท้าย ?t=${Date.now()} ป้องกัน Browser Cache
          if (user?.id) {
            try {
              const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
              if (blob) {
                const ext = file.name?.split('.').pop() || 'jpg';
                const fileName = `avatar_${user.id}_${Date.now()}.${ext}`;
                let bucketName = 'avatars';
                let uploadResult = await supabase.storage.from(bucketName).upload(fileName, blob, {
                  contentType: 'image/jpeg',
                  upsert: true
                });

                if (uploadResult.error) {
                  bucketName = 'chat-images';
                  uploadResult = await supabase.storage.from(bucketName).upload(fileName, blob, {
                    contentType: 'image/jpeg',
                    upsert: true
                  });
                }

                if (!uploadResult.error && uploadResult.data) {
                  const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
                  if (urlData?.publicUrl) {
                    const avatarUrlWithTimestamp = `${urlData.publicUrl}?t=${Date.now()}`;
                    await saveAvatar(avatarUrlWithTimestamp);
                    return;
                  }
                }
              }
            } catch (storageErr) {
              console.log('Supabase storage avatar upload fallback to canvas Base64:', storageErr);
            }
          }

          // Fallback บันทึกแบบ Base64 ลง profiles table
          await saveAvatar(compressedBase64);
        } catch (error) {
          notifyUser(`เปลี่ยนรูปไม่สำเร็จ: ${error.message}`, 'error');
        }
      };
      img.src = imgSrc;
    };

    // ใช้ URL.createObjectURL เพื่อความรวดเร็วและประหยัดหน่วยความจำบนมือถือ
    if (window.URL && typeof window.URL.createObjectURL === 'function') {
      try {
        const objectUrl = URL.createObjectURL(file);
        processImage(objectUrl, true);
        return;
      } catch (err) {
        console.warn('URL.createObjectURL failed, fallback to FileReader', err);
      }
    }

    // Fallback ใช้ FileReader กรณีที่เบราว์เซอร์ไม่รองรับ
    const reader = new FileReader();
    reader.onerror = () => notifyUser('อ่านไฟล์รูปไม่สำเร็จ กรุณาลองเลือกรูปอีกครั้ง', 'error');
    reader.onload = (event) => {
      if (typeof event.target?.result !== 'string') {
        notifyUser('เปิดไฟล์รูปไม่สำเร็จ กรุณาลองเลือกรูปอีกครั้ง', 'error');
        return;
      }
      processImage(event.target.result, false);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelSchedule = async (group) => {
    if (group?.id == null) return;
    if (!isHost(group)) {
      notifyUser('เฉพาะหัวหน้าห้องเท่านั้นที่ยกเลิกนัดนี้ได้');
      return;
    }
    if (confirm(`คุณต้องการยกเลิกนัดหมายวิชา "${group.subject}" ใช่หรือไม่?`)) {
      const { data, error } = await supabase.from('study_groups')
        .delete()
        .eq('id', group.id)
        .select('id');
      if (error || !data?.length) {
        notifyUser(error
          ? 'ยกเลิกนัดหมายไม่สำเร็จ: ' + error.message
          : 'ยกเลิกนัดไม่สำเร็จ: ไม่พบห้องนี้หรือบัญชีของคุณไม่มีสิทธิ์ลบ');
        return;
      }
      setStudyGroups(prev => prev.filter(g => String(g.id) !== String(group.id)));
      setMyJoinedGroupIds(prev => prev.filter(id => String(id) !== String(group.id)));
      if (String(selectedGroup?.id) === String(group.id)) {
        setSelectedGroup(null);
        setCurrentTab('home');
      }
      notifyUser('ยกเลิกนัดหมายเรียบร้อยแล้ว');
    }
  };

  const handleOpenEditGroupModal = () => {
    setCustomSubject(selectedGroup.subject); setGroupTitle(selectedGroup.title);
    setSelectedCategory(selectedGroup.category);
    const existingTime = String(selectedGroup.date_time || '').split('|')[1]?.trim();
    const standardTimes = [
      '09:00 - 12:00 น.',
      '13:00 - 15:00 น.',
      '15:00 - 17:00 น.',
      '17:00 - 19:00 น.'
    ];
    if (existingTime && !standardTimes.includes(existingTime)) {
      setGroupTime('__custom__');
      setCustomGroupTime(existingTime);
    } else if (existingTime) {
      setGroupTime(existingTime);
      setCustomGroupTime('');
    }
    const standardLocations = [
      'อาคาร 11 ชั้น 5 (สำนักหอสมุด SPU)',
      'อาคาร 5 ชั้น 8 (คณะ IT SPU)',
      'อาคาร 9',
      'Google Meet (ออนไลน์)'
    ];
    if (standardLocations.includes(selectedGroup.location)) {
      setLocationText(selectedGroup.location);
      setCustomLocation('');
    } else {
      setLocationText('other');
      setCustomLocation(selectedGroup.location || '');
    }
    setGroupDescription(selectedGroup.description); setIsEditingGroup(true); setCurrentTab('create');
  };

  const handleViewLocationOnMap = (loc) => {
    if (!loc) return;
    setSelectedMapLocation(loc);
    setCurrentTab('map_page');
    setTimeout(() => {
      try {
        const iframe = mapIframeRef.current;
        if (iframe?.contentWindow?.navigateToLocation) {
          iframe.contentWindow.navigateToLocation(loc);
        } else if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'NAVIGATE_LOCATION', location: loc }, '*');
        }
      } catch (e) {
        console.log('Map navigation handled:', e);
      }
    }, 600);
  };

  const handleSaveGroup = async () => {
    if (!groupTitle.trim() || !customSubject.trim()) {
      notifyUser('กรุณากรอกชื่อกลุ่มและวิชาให้ครบถ้วนครับ');
      return;
    }

    let finalStudyTime = groupTime;
    if (groupTime === '__custom__') {
      finalStudyTime = customGroupTime.trim();
      if (!finalStudyTime) {
        notifyUser('กรุณาระบุช่วงเวลาติวในช่องกำหนดเอง');
        return;
      }
    }

    // จัดการสถานที่นัดพบ กรณีเลือก "อื่นๆ" (other)
    let finalLocation = locationText;
    if (locationText === 'other') {
      const trimmedCustom = customLocation.trim();
      if (!trimmedCustom) {
        notifyUser('กรุณาระบุสถานที่นัดพบในช่อง "อื่นๆ" ให้ชัดเจนก่อนบันทึกครับ');
        return;
      }
      finalLocation = trimmedCustom;
    }

    const formattedDateTime = groupDate
      ? `${groupDate} | ${finalStudyTime}`
      : `เสาร์นี้ | ${finalStudyTime}`;

    const computedFormat = finalLocation.includes('Google Meet') || finalLocation.toLowerCase().includes('discord') || finalLocation.includes('ออนไลน์') ? 'online' : 'onsite';

    if (isEditingGroup) {
      if (selectedGroup?.id == null) {
        notifyUser('ไม่พบกลุ่มติวที่ต้องการแก้ไข');
        return;
      }
      const updatedGroup = {
        title: groupTitle.trim(),
        subject: customSubject.trim(),
        category: selectedCategory,
        format: computedFormat,
        location: finalLocation,
        description: groupDescription,
        date_time: formattedDateTime
      };
      const { error } = await supabase.from('study_groups').update(updatedGroup).eq('id', selectedGroup.id);
      if (!error) {
        setSelectedGroup(prev => ({ ...prev, ...updatedGroup }));
        setIsEditingGroup(false);
        setLocationText('อาคาร 11 ชั้น 5 (สำนักหอสมุด SPU)');
        setCustomLocation('');
        notifyUser('แก้ไขข้อมูลห้องติวสำเร็จ!');
        await fetchGroupsFromSupabase();
        setCurrentTab('room_chat');
      } else {
        notifyUser('แก้ไขไม่สำเร็จ: ' + error.message);
      }
    } else {
      const newGroupData = {
        title: groupTitle.trim(),
        subject: customSubject.trim(),
        category: selectedCategory,
        format: computedFormat,
        location: finalLocation,
        description: groupDescription || 'ชวนเพื่อนมาช่วยกันอ่านและแลกเปลี่ยนความรู้ฟรี!',
        date_time: formattedDateTime,
        max_members: Number(maxMembersInput) || 5,
        current_members: 1,
        host_name: currentUser.name,
        host_id: user?.id || user?.email || 'guest'
      };

      const { data, error } = await supabase.from('study_groups').insert([newGroupData]).select();

      if (!error && data?.[0]) {
        setMyJoinedGroupIds(prev => Array.from(new Set([...prev, data[0].id])));
        setSelectedGroup(data[0]);
        setLocationText('อาคาร 11 ชั้น 5 (สำนักหอสมุด SPU)');
        setCustomLocation('');
        await fetchGroupsFromSupabase();
        notifyUser('🎉 สร้างห้องติวใหม่สำเร็จเรียบร้อยแล้ว!');
        setCurrentTab('home');
      } else {
        notifyUser('⚠ สร้างห้องไม่สำเร็จเนื่องจาก: ' + (error?.message || 'โปรดตรวจสอบสิทธิ์ RLS ใน Supabase'));
      }
    }

    setGroupTitle('');
    setCustomSubject('');
    setGroupDescription('');
    setLocationText('อาคาร 11 ชั้น 5 (สำนักหอสมุด SPU)');
    setCustomLocation('');
  };

  const handleOpenPrivateChat = (targetUser) => {
    setShowQuickFriendModal(false);
    const cleanName = (targetUser.name || targetUser.display_name || targetUser.email?.split('@')[0] || 'เพื่อน').replace(/\s*\(นักศึกษา SPU\)/g, '');
    setActivePrivateMember({
      id: targetUser.id,
      name: cleanName,
      avatar: targetUser.avatar || cartoonAvatars[0].url,
      gender: targetUser.gender || ''
    });

    setRecentDMMessages(prev => ({ ...prev, [targetUser.id]: { ...prev[targetUser.id], unread: false } }));
    // Bug 3 fix: mark DM notifications as read when opening the chat
    setNotifications(prev => prev.map(n =>
      (n.type === 'dm' && n.targetUser?.id === targetUser.id)
        ? { ...n, read: true }
        : n
    ));
    setCurrentTab('private_chat');
  };

  const filteredGroups = studyGroups.filter(g => {
    const matchSearch = searchTerm === '' || g.title?.toLowerCase().includes(searchTerm.toLowerCase()) || g.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && (activeCategory === 'ทั้งหมด' || g.category === activeCategory);
  }).sort((a, b) => {
    if (groupSortMode === 'capacity') {
      const occupancyA = Number(a.current_members || 0) / Math.max(Number(a.max_members || 5), 1);
      const occupancyB = Number(b.current_members || 0) / Math.max(Number(b.max_members || 5), 1);
      return occupancyB - occupancyA;
    }
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  const myJoinedGroups = studyGroups.filter(g => myJoinedGroupIds.includes(g.id) || isHost(g))
    .sort((a, b) => (recentGroupMessages[b.id]?.timestamp || 0) - (recentGroupMessages[a.id]?.timestamp || 0));

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const nextUpcomingSchedule = myJoinedGroups
    .map(group => ({ group, date: getStudySessionDate(group.date_time) }))
    .filter(item => item.date && item.date >= new Date())
    .sort((a, b) => a.date - b.date)[0] || null;

  const sortedAcceptedFriends = [...acceptedFriends].sort((a, b) => {
    const timeA = recentDMMessages[a.id]?.timestamp || 0;
    const timeB = recentDMMessages[b.id]?.timestamp || 0;
    return timeB - timeA;
  });

  const categories = ['ทั้งหมด', 'ภาษาต่างประเทศ', 'วิชาการ', 'เทคโนโลยี/ไอที', 'ทักษะทั่วไป'];
  const getCategoryCount = (category) => category === 'ทั้งหมด'
    ? studyGroups.length
    : studyGroups.filter(group => group.category === category).length;
  const pendingMembers = groupMembers.filter(m => m.status === 'pending');
  const bitHour = new Date().getHours();
  const bitGreeting = bitHour < 12 ? 'อรุณสวัสดิ์!' : bitHour < 17 ? 'สวัสดีตอนบ่าย!' : 'สวัสดีตอนเย็น!';
  const bitTimePhrase = bitHour < 12
    ? 'เริ่มวันใหม่ด้วยการหากลุ่มติวดีไหม?'
    : bitHour < 17
      ? 'พักจากเรียนแป๊บหนึ่ง แล้วมาติวด้วยกันไหม?'
      : 'เย็นนี้มาเก็บวิชาที่ยังค้างกันเถอะ!';
  const bitPhrases = [
    'พร้อมหากลุ่มติวด้วยกันไหม?',
    'ลองพิมพ์ชื่อวิชาที่สนใจในช่องค้นหาดูเลย',
    'ค่อย ๆ เรียนไปด้วยกัน เก่งขึ้นได้แน่นอน!',
    'เยี่ยม! ก้าวเล็ก ๆ ก็พาเราเก่งขึ้น',
    'อยากเปิดห้องติวใหม่ก็ทำได้เลยนะ'
  ];
  const hasSearchResults = filteredGroups.length > 0 || searchedFriends.length > 0;
  const homeBitMessage = isSearchingRealtime
    ? 'กำลังช่วยค้นหาให้อยู่นะ...'
    : searchTerm.trim()
      ? hasSearchResults
        ? 'เจอแล้ว! เลือกรายการที่สนใจได้เลย'
        : 'ยังไม่เจอ ลองเปลี่ยนคำค้นดูนะ'
      : bitPhraseIndex === 0
        ? bitTimePhrase
        : bitPhrases[bitPhraseIndex];
  const homeBitMood = searchTerm.trim() && !isSearchingRealtime && !hasSearchResults
    ? 'thinking'
    : bitMood;

  return (
    <div className="bg-slate-950 min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto overscroll-contain sm:px-4 sm:py-0 flex justify-center items-center font-sans">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .studybuddy-app-frame { width: 100%; max-width: 480px; min-height: 0; height: 100dvh; flex: none; }
        @media (min-width: 640px) {
          .studybuddy-app-frame {
            width: min(480px, calc(100vw - 2rem));
            height: min(900px, 100dvh);
          }
        }
        .bit-mascot__float { transform-box: fill-box; transform-origin: center; animation: bit-float 2.8s ease-in-out infinite; }
        .bit-mascot__shadow { transform-box: fill-box; transform-origin: center; animation: bit-shadow 2.8s ease-in-out infinite; }
        .bit-mascot__wave-arm { transform-box: view-box; transform-origin: 88px 72px; animation: bit-wave 1.45s ease-in-out infinite; }
        .bit-mascot__eyes { transform-box: fill-box; transform-origin: center; animation: bit-blink 4.8s ease-in-out infinite; }
        .bit-mascot__thought { transform-box: fill-box; transform-origin: center; animation: bit-thought 1.1s ease-in-out infinite; }
        .bit-mascot__confetti { transform-box: fill-box; transform-origin: center; animation: bit-confetti .55s ease-in-out infinite alternate; }
        .bit-hero-mascot { animation: bit-arrive .72s cubic-bezier(.2,.8,.2,1) both; }
        .bit-mascot--thinking .bit-mascot__float { animation: bit-think 2s ease-in-out infinite; }
        .bit-mascot--thinking .bit-mascot__wave-arm { animation: bit-chin 2s ease-in-out infinite; }
        .bit-mascot--cheer .bit-mascot__float { animation: bit-celebrate .62s cubic-bezier(.3,.8,.3,1) 5; }
        .bit-mascot--cheer .bit-mascot__wave-arm { animation: bit-cheer-wave .62s ease-in-out 5; }
        @keyframes bit-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes bit-shadow { 0%, 100% { transform: scaleX(1); opacity: .12; } 50% { transform: scaleX(.82); opacity: .07; } }
        @keyframes bit-wave { 0%, 100% { transform: rotate(0); } 22%, 58% { transform: rotate(-38deg); } 40%, 76% { transform: rotate(22deg); } }
        @keyframes bit-chin { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(-38deg); } }
        @keyframes bit-think { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-3px) rotate(-4deg); } }
        @keyframes bit-thought { 0%, 100% { transform: translateY(2px) scale(.9); opacity: .75; } 50% { transform: translateY(-3px) scale(1.08); opacity: 1; } }
        @keyframes bit-confetti { from { transform: scale(.85) rotate(-6deg); opacity: .65; } to { transform: scale(1.12) rotate(6deg); opacity: 1; } }
        @keyframes bit-celebrate { 0%, 100% { transform: translateY(0) rotate(0) scale(1); } 35% { transform: translateY(-16px) rotate(-8deg) scale(1.04); } 70% { transform: translateY(1px) rotate(7deg) scale(.98); } }
        @keyframes bit-cheer-wave { 0%, 100% { transform: rotate(0); } 25%, 75% { transform: rotate(-48deg); } 50% { transform: rotate(32deg); } }
        @keyframes bit-arrive { 0% { opacity: 0; transform: translateY(22px) scale(.78) rotate(-8deg); } 72% { opacity: 1; transform: translateY(-5px) scale(1.06) rotate(3deg); } 100% { transform: translateY(0) scale(1) rotate(0); } }
        @keyframes bit-blink { 0%, 44%, 48%, 100% { transform: scaleY(1); } 46% { transform: scaleY(.12); } }
        @keyframes room-message-enter { from { opacity: 0; transform: translateY(12px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes room-plane-send { 0% { transform: translate(0, 0) rotate(0); } 45% { transform: translate(4px, -4px) rotate(14deg) scale(1.12); } 100% { transform: translate(0, 0) rotate(0); } }
        .room-message-enter { animation: room-message-enter .28s cubic-bezier(.2,.8,.2,1) both; }
        .room-plane-send { animation: room-plane-send .42s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .bit-hero-mascot, .bit-mascot__float, .bit-mascot__shadow, .bit-mascot__wave-arm, .bit-mascot__eyes, .bit-mascot__thought, .bit-mascot__confetti { animation: none !important; }
          .room-message-enter, .room-plane-send { animation: none !important; }
        }
      `}</style>

      {/* Frame มือถือ พร้อมระบบเปิดไฟปิดไฟ */}
      <div className={`studybuddy-app-frame max-w-4xl rounded-none sm:rounded-[40px] shadow-2xl border-0 sm:border-[6px] overflow-hidden flex flex-col relative transition-all duration-300 bg-[#F8FAFC] border-slate-800 ${!user && isSparking ? 'ring-4 ring-amber-400 scale-[0.998]' : ''
        }`}>

        {actionToast && (
          <div className="pointer-events-none absolute inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[60]" aria-live={actionToast.type === 'error' ? 'assertive' : 'polite'}>
            <div
              role={actionToast.type === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start gap-2.5 rounded-2xl border p-3 shadow-xl backdrop-blur-md ${actionToast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50/95 text-emerald-950'
                : actionToast.type === 'error'
                  ? 'border-rose-200 bg-rose-50/95 text-rose-950'
                  : 'border-indigo-200 bg-white/95 text-slate-900'
                }`}
            >
              {actionToast.type === 'success' ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> :
                actionToast.type === 'error' ? <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" /> :
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />}
              <p className="max-h-20 flex-1 overflow-y-auto overscroll-contain text-xs leading-relaxed">{actionToast.message}</p>
              <button onClick={dismissActionToast} aria-label="ปิดข้อความแจ้งเตือน" className="-mr-1 -mt-1 rounded-lg p-1 text-slate-500 hover:bg-black/5">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* REALTIME NOTIFICATION */}
        {toastNotification && (
          <div onClick={() => { handleNotificationClick(toastNotification); setToastNotification(null); }} className="absolute top-12 left-4 right-4 bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md border border-indigo-500/40 z-50 flex flex-col gap-2 cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5 flex-1 pr-2">
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">{toastNotification.title}</h4>
                <p className="text-[11px] text-slate-200 leading-snug line-clamp-2">{toastNotification.message}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setToastNotification(null); }} className="p-1 text-slate-400 hover:text-white shrink-0"><X className="w-4 h-4" /></button>
            </div>
            {toastNotification.type === 'join_request' && !toastNotification.isHandled && (
              <div className="flex gap-2 pt-1 border-t border-slate-700/60" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => handleApproveMember(toastNotification.memberReqId, 'accepted')} className="flex-1 bg-emerald-600 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 hover:bg-emerald-700"><Check className="w-3.5 h-3.5" /> ยอมรับ</button>
                <button onClick={() => handleApproveMember(toastNotification.memberReqId, 'rejected')} className="flex-1 bg-rose-500 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 hover:bg-rose-600"><X className="w-3.5 h-3.5" /> ไม่ยอมรับ</button>
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS LIST MODAL */}
        {showNotificationModal && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full rounded-3xl p-4 space-y-3 shadow-2xl max-h-[480px] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5"><Bell className="w-4 h-4 text-indigo-600" /><h3 className="font-bold text-xs text-slate-900">การแจ้งเตือนล่าสุด ({notifications.length}/15)</h3></div>
                <button onClick={() => setShowNotificationModal(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain space-y-2 no-scrollbar text-xs">
                {notifications.length === 0 ? <p className="text-center text-slate-400 text-[10px] py-4">ไม่มีการแจ้งเตือนใหม่</p> :
                  notifications.map((n) => (
                    <div key={n.id} className={`border p-3 rounded-2xl space-y-1.5 ${n.isHandled || n.read ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-indigo-50/40 border-indigo-200'}`}>
                      <div className="flex justify-between items-center" onClick={() => handleNotificationClick(n)}>
                        <span className="font-bold text-indigo-900 text-xs flex items-center gap-1">{n.title} {!n.isHandled && !n.read && <span className="w-2 h-2 bg-rose-500 rounded-full inline-block"></span>}</span>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-600">{n.desc}</p>

                      {n.type === 'join_request' && !n.isHandled ? (
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => handleApproveMember(n.memberReqId, 'accepted', n.id)} className="flex-1 bg-emerald-600 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 hover:bg-emerald-700"><Check className="w-3.5 h-3.5" /> ยอมรับ</button>
                          <button onClick={() => handleApproveMember(n.memberReqId, 'rejected', n.id)} className="flex-1 bg-rose-500 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 hover:bg-rose-600"><X className="w-3.5 h-3.5" /> ไม่ยอมรับ</button>
                        </div>
                      ) : n.type === 'friend_request' && !n.isHandled ? (
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const req = friendRequests.find(r => r.id === n.requestId) || { id: n.requestId, sender_name: n.title };
                              handleRejectFriendRequest(req.id);
                            }}
                            className="flex-1 border border-slate-200 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition"
                          >
                            <X className="w-3.5 h-3.5" /> ปฏิเสธ
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const req = friendRequests.find(r => r.id === n.requestId) || { id: n.requestId, sender_name: n.title };
                              handleAcceptFriendRequest(req);
                            }}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 shadow-xs transition"
                          >
                            <Check className="w-3.5 h-3.5" /> ยอมรับ
                          </button>
                        </div>
                      ) : n.statusText && (
                        <div className="pt-1 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${n.statusText.includes('อนุมัติ') || n.statusText.includes('เพื่อน') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {n.statusText}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* MEMBERS MODAL */}
        {showMemberListModal && selectedGroup && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full rounded-3xl p-4 space-y-3 shadow-2xl max-h-[480px] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-600" /><h3 className="font-bold text-xs text-slate-900">สมาชิกในห้องติว ({groupMembers.filter(m => m.status === 'accepted').length + 1}/{selectedGroup.max_members || 5})</h3></div>
                <button onClick={() => setShowMemberListModal(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain space-y-2 no-scrollbar text-xs">
                <div className="bg-indigo-50/80 p-2.5 rounded-2xl border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">👑</div>
                    <div><h4 className="font-bold text-xs text-slate-900">{selectedGroup.host_name}</h4><p className="text-[9px] text-indigo-600 font-bold">Host ผู้สร้างกลุ่ม</p></div>
                  </div>
                </div>

                {pendingMembers.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-indigo-900 block">⚠️ คำขอเข้าร่วมกลุ่ม ({pendingMembers.length})</span>
                    {pendingMembers.map(m => (
                      <div key={m.id} className="bg-indigo-50/50 p-2.5 rounded-2xl border border-indigo-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={m.user_avatar || cartoonAvatars[0].url} className="w-8 h-8 rounded-full border object-cover bg-indigo-50" />
                          <div><div className="flex items-center gap-1.5"><h4 className="font-bold text-xs text-slate-900">{m.user_name}</h4><GenderBadge gender={m.gender} /></div><p className="text-[9px] text-indigo-600 font-bold">รออนุมัติ</p></div>
                        </div>
                        {isHost(selectedGroup) ? (
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => handleApproveMember(m.id, 'accepted')} className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-0.5 hover:bg-emerald-700"><Check className="w-3.5 h-3.5" /> ยอมรับ</button>
                            <button onClick={() => handleApproveMember(m.id, 'rejected')} className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-0.5 hover:bg-rose-600"><X className="w-3.5 h-3.5" /> ไม่ยอมรับ</button>
                          </div>
                        ) : <span className="text-[9px] text-slate-400 font-bold italic">รอหัวหน้าห้องอนุมัติ</span>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 block">สมาชิกทั้งหมดในห้อง</span>
                  {groupMembers.filter(m => m.status === 'accepted').map(m => (
                    <div key={m.id} className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center gap-2">
                      <img src={m.user_avatar || cartoonAvatars[0].url} className="w-8 h-8 rounded-full border object-cover bg-indigo-50" />
                      <div><div className="flex items-center gap-1.5"><h4 className="font-bold text-xs text-slate-900">{m.user_name}</h4><GenderBadge gender={m.gender} /></div><p className="text-[9px] text-emerald-600 font-bold">● สมาชิกอนุมัติแล้ว</p></div>
                    </div>
                  ))}
                </div>

                {isHost(selectedGroup) && (
                  <div className="pt-3 border-t border-slate-100">
                    <button onClick={handleDeleteGroup} className="w-full bg-rose-50 text-rose-600 font-bold py-2.5 rounded-xl border border-rose-200 text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100">
                      <Trash2 className="w-4 h-4" /> 🚨 ยุบและลบห้องติวนี้
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUICK SEARCH FRIEND MODAL */}
        {showQuickFriendModal && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full rounded-3xl p-4 space-y-3 shadow-2xl max-h-[480px] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5"><UserPlus className="w-4 h-4 text-indigo-600" /><h3 className="font-bold text-xs text-slate-900">ค้นหาเพื่อน / ทักแชตด่วน</h3></div>
                <button onClick={() => setShowQuickFriendModal(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" value={friendSearchTerm} onChange={(e) => setFriendSearchTerm(e.target.value)} placeholder="พิมพ์ชื่อเพื่อน..." className="w-full text-xs outline-none bg-transparent" autoFocus />
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain space-y-2 no-scrollbar text-xs">
                {friendSearchTerm.trim() !== '' ? (
                  searchedFriends.map((u) => {
                    const isAccepted = acceptedFriends.some(f => f.id === u.id);
                    const pendingReceivedReq = friendRequests.find(r => r.sender_id === u.id);
                    const isPendingSent = sentFriendRequests.some(r => r.receiver_id === u.id);
                    return (
                      <div key={u.id} className="bg-white p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5"><img src={u.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-indigo-50" /><div><div className="flex items-center gap-1.5"><h4 className="font-bold text-xs text-slate-900">{u.name}</h4><GenderBadge gender={u.gender} /></div><p className="text-[9px] text-slate-400">{u.faculty}</p></div></div>
                        {isAccepted ? (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleOpenPrivateChat(u)} className="bg-[#4338CA] text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-700"><MessageCircle className="w-3 h-3" /> ทักแชต</button>
                            <button onClick={() => handleUnfriend(u.id)} className="flex items-center gap-0.5 text-[9px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1.5 rounded-lg transition" title="ลบเพื่อน"><UserMinus className="w-3 h-3" /> ลบเพื่อน</button>
                          </div>
                        ) : pendingReceivedReq ? (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleAcceptFriendRequest(pendingReceivedReq)} className="bg-emerald-600 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-700 shadow-xs"><Check className="w-3 h-3" /> ยอมรับ</button>
                            <button onClick={() => handleRejectFriendRequest(pendingReceivedReq)} className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[9px] font-bold px-2 py-1.5 rounded-lg border border-slate-200 transition" title="ปฏิเสธ"><X className="w-3 h-3" /></button>
                          </div>
                        ) : isPendingSent ? (
                          <div className="flex items-center gap-1">
                            <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-amber-200">รอตอบรับ</span>
                            <button onClick={() => handleCancelFriendRequest(u.id)} className="bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-[9px] font-bold px-2 py-1.5 rounded-lg border border-slate-200 transition" title="ยกเลิกคำขอ"><X className="w-3 h-3" /></button>
                          </div>
                        ) : (
                          <button onClick={() => handleSendFriendRequest(u)} className="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-indigo-200 flex items-center gap-1 hover:bg-indigo-100"><UserPlus className="w-3 h-3" /> แอดเพื่อน</button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  acceptedFriends.map((f) => (
                    <div key={f.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl flex items-center justify-between">
                      <div onClick={() => handleOpenPrivateChat({ id: f.id, name: f.display_name || f.email.split('@')[0], avatar: f.avatar, gender: f.gender })} className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0 pr-2">
                        <img src={f.avatar || cartoonAvatars[0].url} className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-indigo-50" />
                        <div className="truncate"><h4 className="font-bold text-xs text-slate-900 truncate">{(f.display_name || f.email.split('@')[0]).replace(/\s*\(นักศึกษา SPU\)/g, '')}</h4><p className="text-[9px] text-emerald-600 font-bold">● พร้อมแชต</p></div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => handleOpenPrivateChat({ id: f.id, name: f.display_name || f.email.split('@')[0], avatar: f.avatar, gender: f.gender })} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> ทักแชต</button>
                        <button onClick={() => handleUnfriend(f.id)} className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1.5 rounded-lg transition" title="ลบเพื่อน"><UserMinus className="w-3.5 h-3.5" /> ลบเพื่อน</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* AUTH SCREEN */}
        {!user ? (
          <div
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain no-scrollbar relative transition-colors duration-500 bg-[#F8FAFC]"
          >
            <canvas
              ref={rainCanvasRef}
              className="absolute inset-0 pointer-events-none z-0 opacity-80"
            />


            <div className="pt-10 pb-8 px-6 text-white text-center relative overflow-hidden rounded-b-[36px] shadow-lg shrink-0 transition-all duration-500 z-10 bg-gradient-to-br from-indigo-700 via-indigo-600 to-slate-900">
              <div className="absolute top-4 left-4 z-20 flex flex-col items-start select-none pointer-events-none">
                <div className="relative inline-block">
                  <span className="text-2xl font-black tracking-tight text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] font-sans">
                    SPU
                  </span>
                  <span className="absolute -bottom-1.5 right-0 w-3.5 h-[3px] bg-[#EC4899] rounded-xs shadow-[0_0_8px_#EC4899]"></span>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-4 w-20 h-20 bg-indigo-400/20 rounded-full blur-lg pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-3 shadow-inner bg-white/10">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">StudyBuddy</h1>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                </div>
                <p className="text-sm text-indigo-100/90 font-medium max-w-sm">
                  ศูนย์รวมกลุ่มติวหนังสือ & หาเพื่อนเรียน SPU
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-semibold text-white">Sripatum University</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pt-6 pb-32 flex flex-col z-10 relative">
              <div className="mx-auto my-auto w-full max-w-md">
                <div className="p-1 rounded-2xl flex gap-1 mb-4 transition-all bg-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === 'login'
                      ? 'bg-white text-indigo-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === 'register'
                      ? 'bg-white text-indigo-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    สมัครสมาชิก
                  </button>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3.5">
                  {authMode === 'register' && (
                    <div>
                      <label className="text-xs font-bold block mb-1.5 text-slate-600">
                        ชื่อแสดงผล / Display Name
                      </label>
                      <div className="flex items-center border rounded-2xl px-3.5 py-2.5 gap-2 transition-all bg-white/90 border-slate-200 text-slate-800 focus-within:border-indigo-500 backdrop-blur-md">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="เช่น ชื่อเล่นที่ใช้แสดง"
                          className="w-full text-sm outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold block mb-1.5 text-slate-600">
                      อีเมล / Email
                    </label>
                    <div className="flex items-center border rounded-2xl px-3.5 py-2.5 gap-2 transition-all bg-white/90 border-slate-200 text-slate-800 focus-within:border-indigo-500 backdrop-blur-md">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="กรอกอีเมลของคุณ"
                        className="w-full text-sm outline-none bg-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1.5 text-slate-600">
                      รหัสผ่าน / Password
                    </label>
                    <div className="flex items-center border rounded-2xl px-3.5 py-2.5 gap-2 transition-all bg-white/90 border-slate-200 text-slate-800 focus-within:border-indigo-500 backdrop-blur-md">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="password"
                        autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-sm outline-none bg-transparent"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5 mt-4 disabled:opacity-70 bg-[#4338CA] hover:bg-indigo-700 shadow-indigo-600/20"
                  >
                    {authLoading ? (
                      'กำลังดำเนินการ...'
                    ) : authMode === 'login' ? (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>เข้าสู่ระบบห้องติว</span>
                      </>
                    ) : (
                      <>
                        <span>ยืนยันสมัครสมาชิก</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-3 my-4" aria-hidden="true">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-500">
                    หรือ {authMode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}ด้วย
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={authLoading}
                  aria-label={authMode === 'login' ? 'เข้าสู่ระบบด้วย Google' : 'สมัครสมาชิกด้วย Google'}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl border py-3.5 text-sm font-bold transition-colors disabled:opacity-60 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
                    <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
                    <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
                    <path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z" />
                    <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z" />
                  </svg>
                  <span>{authMode === 'login' ? 'เข้าสู่ระบบด้วย Google' : 'สมัครสมาชิกด้วย Google'}</span>
                </button>
              </div>

              <div className="mx-auto mb-auto w-full max-w-md text-center pt-4">
                <p className="text-sm text-slate-500">
                  {authMode === 'login' ? (
                    <>
                      ยังไม่มีบัญชีใช่ไหม?{' '}
                      <span
                        onClick={() => setAuthMode('register')}
                        className="font-bold cursor-pointer hover:underline text-indigo-600"
                      >
                        สมัครสมาชิกใหม่
                      </span>
                    </>
                  ) : (
                    <>
                      มีบัญชีอยู่แล้ว?{' '}
                      <span
                        onClick={() => setAuthMode('login')}
                        className="font-bold cursor-pointer hover:underline text-indigo-600"
                      >
                        เข้าสู่ระบบ
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* TOP HEADER */}
            {currentTab !== 'room_chat' && currentTab !== 'private_chat' && (
              <div className="px-5 pt-6 pb-3 flex items-center justify-between border-b shrink-0 z-20 transition-colors bg-white border-slate-100">
                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentTab('home')}>
                  <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-xs">S</div>
                  <span className="font-bold text-lg text-[#4F46E5]">StudyBuddy</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowQuickFriendModal(true)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full border border-indigo-100 bg-indigo-50/50"><UserPlus className="w-5 h-5" /></button>
                  <button onClick={() => setCurrentTab('my_groups')} className={`p-1.5 rounded-full relative ${currentTab === 'my_groups' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <MessageCircle className="w-5 h-5" />
                    {(friendRequests.length > 0 || Object.values(recentDMMessages).some(m => m.unread)) && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
                  </button>
                  <button onClick={handleOpenNotifications} className="relative p-1.5 text-slate-600 hover:bg-slate-100 rounded-full">
                    <Bell className="w-5 h-5 text-slate-600" />
                    {hasUnreadNotification && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
                  </button>
                  <img src={currentUser.avatar} alt="Profile" onClick={() => setCurrentTab('profile')} className={`w-7 h-7 rounded-full border object-cover cursor-pointer bg-indigo-50 ${currentTab === 'profile' ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200'}`} />
                </div>
              </div>
            )}

            {/* PAGE 1: HOME */}
            {currentTab === 'home' && (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-3 pb-32 space-y-3.5 no-scrollbar relative">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">สวัสดี, {currentUser.name} 👋</h1>
                  <p className="text-xs text-slate-500">หาเพื่อนติววิชาอะไร วันนี้?</p>
                </div>

                <div className="relative flex min-h-[158px] items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-700 p-3.5 text-white shadow-lg">
                  <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
                  <span aria-hidden="true" className="pointer-events-none absolute right-[118px] top-3 text-xl text-amber-200 animate-pulse">✦</span>
                  <span aria-hidden="true" className="pointer-events-none absolute right-[104px] bottom-7 text-xs text-white/80">✦</span>
                  <div className="relative z-10 flex min-w-0 flex-1 flex-col items-start gap-2">
                    <span className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[9px] font-bold tracking-wide text-indigo-50">🤖 BIT · STUDY BUDDY</span>
                    <h2 className="text-base font-black leading-tight">{bitGreeting} วันนี้มาเริ่มติวกัน!</h2>
                    <p className="min-h-[34px] rounded-2xl rounded-tl-sm bg-white/95 px-3 py-2 text-[10px] font-semibold leading-relaxed text-indigo-950 shadow-sm">
                      {homeBitMessage}
                    </p>
                    <button onClick={() => homeSearchInputRef.current?.focus()} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-950/25 px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-indigo-950/40 active:scale-95">
                      ค้นหากลุ่มติว <Search className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setBitPhraseIndex(index => (index + 1) % bitPhrases.length); setBitMood('wave'); }}
                    aria-label="คุยกับน้องบิต เปลี่ยนข้อความให้กำลังใจ"
                    title="แตะเพื่อคุยกับน้องบิต"
                    className="bit-hero-mascot relative z-10 -mr-2 flex h-[144px] w-[112px] shrink-0 items-end justify-center rounded-2xl transition-transform hover:scale-105 active:scale-95"
                  >
                    <StudyBuddyBit className="h-[136px] w-[112px]" mood={homeBitMood} />
                  </button>
                </div>

                {allPendingRequests.length > 0 && (
                  <div className="bg-[#EEF2FF] border border-indigo-200 p-3.5 rounded-2xl space-y-2 shadow-xl backdrop-blur-md">
                    <div className="flex items-center justify-between text-indigo-950 font-bold text-xs">
                      <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />คำขอเข้าร่วมกลุ่มติว ({allPendingRequests.length})</span>
                    </div>
                    <div className="space-y-2 pt-0.5">
                      {allPendingRequests.map(req => (
                        <div key={req.id} className="bg-white/90 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-slate-900 truncate">{req.user_name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">ขอเข้าห้อง: {req.study_groups?.title || 'ห้องติวของคุณ'}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => handleApproveMember(req.id, 'accepted')} className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] flex items-center gap-1 hover:bg-emerald-700"><Check className="w-3.5 h-3.5" /> ยอมรับ</button>
                            <button onClick={() => handleApproveMember(req.id, 'rejected')} className="bg-rose-500 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] flex items-center gap-1 hover:bg-rose-600"><X className="w-3.5 h-3.5" /> ไม่ยอมรับ</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button type="button" aria-label="เปิดแผนที่จุดนัดพบติว SPU Hub" onClick={() => setCurrentTab('map_page')} className="group w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-left text-white rounded-2xl p-3.5 flex items-center justify-between gap-2 cursor-pointer shadow-md transition-all duration-200 hover:shadow-lg hover:from-indigo-500 hover:to-indigo-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs">จุดนัดพบติว ม.ศรีปทุม (SPU Hub)</h4>
                    <p className="text-[10px] text-indigo-100">พิกัดจุดติว BTS บางบัว • อาคาร 11, 5 และศูนย์อาหาร</p>
                  </div>
                  <div aria-hidden="true" className="relative h-11 w-[82px] shrink-0 overflow-hidden rounded-xl border border-white/25 bg-indigo-100/95 shadow-inner transition-transform duration-200 group-hover:scale-105">
                    <svg viewBox="0 0 82 44" className="absolute inset-0 h-full w-full" fill="none">
                      <rect width="82" height="44" rx="10" fill="#E0F2FE" />
                      <path d="M-4 9 22 17 35 8 56 14 86 5M-5 35 18 28 34 39 53 29 86 36M12-4l8 18-5 17 8 18M48-5l-4 16 8 14-5 24M73-5l-8 18 7 15-4 19" stroke="#CBD5E1" strokeWidth="5" />
                      <path d="M-4 9 22 17 35 8 56 14 86 5M-5 35 18 28 34 39 53 29 86 36" stroke="#FFFFFF" strokeWidth="2.2" />
                      <path d="m60 3 4 6m-36 25 5 5m29 10-2-8" stroke="#86EFAC" strokeWidth="5" strokeLinecap="round" />
                      <circle cx="42" cy="21" r="10" fill="#F97316" fillOpacity=".2" />
                      <path d="M42 12.5c-4.1 0-7.4 3.2-7.4 7.2 0 5.3 7.4 12 7.4 12s7.4-6.7 7.4-12c0-4-3.3-7.2-7.4-7.2Z" fill="#F97316" stroke="#FFF7ED" strokeWidth="1.5" />
                      <circle cx="42" cy="19.5" r="2.5" fill="white" />
                    </svg>
                    <span className="absolute bottom-0.5 right-0.5 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white shadow group-hover:bg-indigo-500"><ArrowRight className="h-3 w-3" /></span>
                  </div>
                </button>

                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/70 to-violet-50/80 p-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-indigo-600 shadow-sm"><Calendar className="h-3 w-3" /> นัดถัดไป</span>
                      {nextUpcomingSchedule ? (
                        <>
                          <h3 className="mt-2 truncate text-xs font-extrabold text-slate-800">{nextUpcomingSchedule.group.title}</h3>
                          <p className="mt-1 text-[10px] font-semibold text-slate-600">
                            {nextUpcomingSchedule.date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })}
                            {nextUpcomingSchedule.group.date_time?.includes('|') ? ` · ${nextUpcomingSchedule.group.date_time.split('|')[1].trim()}` : ''}
                          </p>
                          <button type="button" onClick={() => handleViewLocationOnMap(nextUpcomingSchedule.group.location)} className="mt-1 flex items-center gap-1 truncate text-[10px] text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer text-left"><MapPin className="h-3 w-3 shrink-0 text-orange-500" /><span>{nextUpcomingSchedule.group.location}</span></button>
                        </>
                      ) : (
                        <p className="mt-2 text-[11px] font-semibold text-slate-600">ยังไม่มีนัดที่กำลังจะถึง</p>
                      )}
                    </div>
                    <button type="button" onClick={() => setCurrentTab('schedule')} className="shrink-0 self-center rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95">
                      ดูตาราง <ArrowRight className="ml-1 inline h-3 w-3" />
                    </button>
                  </div>
                  {nextUpcomingSchedule && (
                    <div className="mt-2 border-t border-indigo-100 pt-2 text-[9px] font-bold text-indigo-600">
                      {nextUpcomingSchedule.date.toDateString() === todayStart.toDateString()
                        ? 'นัดติววันนี้'
                        : `อีก ${Math.ceil((new Date(nextUpcomingSchedule.date.getFullYear(), nextUpcomingSchedule.date.getMonth(), nextUpcomingSchedule.date.getDate()) - todayStart) / 86400000)} วัน`}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input ref={homeSearchInputRef} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ค้นหาวิชา (IELTS, Calculus) หรือ ค้นหาชื่อเพื่อน..." className="w-full text-xs outline-none bg-transparent" />
                  </div>
                </div>

                {searchTerm.trim() !== '' && (
                  <div className="space-y-2 bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-700 block">{isSearchingRealtime ? 'กำลังค้นหาเพื่อน...' : '👤 เพื่อนที่พบ:'}</span>
                    {searchedFriends.map((u) => {
                      const isAccepted = acceptedFriends.some(f => f.id === u.id);
                      const pendingReceivedReq = friendRequests.find(r => r.sender_id === u.id);
                      const isPendingSent = sentFriendRequests.some(r => r.receiver_id === u.id);
                      return (
                        <div key={u.id} className="bg-white p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2.5"><img src={u.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-indigo-50" /><div><div className="flex items-center gap-1.5"><h4 className="font-bold text-xs text-slate-900">{u.name}</h4><GenderBadge gender={u.gender} /></div><p className="text-[9px] text-slate-400">{u.faculty}</p></div></div>
                          {isAccepted ? (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => handleOpenPrivateChat(u)} className="bg-[#4338CA] text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-700"><MessageCircle className="w-3 h-3" /> ทักแชต</button>
                              <button onClick={() => handleUnfriend(u.id)} className="flex items-center gap-0.5 text-[9px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1.5 rounded-lg transition" title="ลบเพื่อน"><UserMinus className="w-3 h-3" /> ลบเพื่อน</button>
                            </div>
                          ) : pendingReceivedReq ? (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => handleRejectFriendRequest(pendingReceivedReq.id)} className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[9px] font-bold px-2 py-1.5 rounded-lg border border-slate-200 transition">ปฏิเสธ</button>
                              <button onClick={() => handleAcceptFriendRequest(pendingReceivedReq)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition"><Check className="w-3 h-3" /> ยอมรับ</button>
                            </div>
                          ) : isPendingSent ? (
                            <div className="flex items-center gap-1">
                              <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-amber-200">รอตอบรับ</span>
                              <button onClick={() => handleCancelFriendRequest(u.id)} className="bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-[9px] font-bold px-2 py-1.5 rounded-lg border border-slate-200 transition" title="ยกเลิกคำขอ"><X className="w-3 h-3" /></button>
                            </div>
                          ) : (
                            <button onClick={() => handleSendFriendRequest(u)} className="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-indigo-200 flex items-center gap-1 hover:bg-indigo-100"><UserPlus className="w-3 h-3" /> แอดเพื่อน</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {categories.map((cat) => (
                    <button key={cat} aria-pressed={activeCategory === cat} onClick={() => setActiveCategory(cat)} className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#4338CA] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-700'}`}>{cat} <span className={`ml-0.5 text-[9px] ${activeCategory === cat ? 'text-indigo-200' : 'text-slate-400'}`}>{getCategoryCount(cat)}</span></button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-slate-400">เรียงตาม</span>
                  <div className="flex gap-1.5">
                    <button type="button" aria-pressed={groupSortMode === 'newest'} onClick={() => setGroupSortMode('newest')} className={`rounded-lg px-2.5 py-1.5 text-[9px] font-bold transition ${groupSortMode === 'newest' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>🆕 ใหม่ล่าสุด</button>
                    <button type="button" aria-pressed={groupSortMode === 'capacity'} onClick={() => setGroupSortMode('capacity')} className={`rounded-lg px-2.5 py-1.5 text-[9px] font-bold transition ${groupSortMode === 'capacity' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>👥 ใกล้เต็ม</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">📚 ห้องติวที่พบ ({filteredGroups.length})</span>
                  {filteredGroups.map((group) => (
                    <div key={group.id} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-semibold">
                        <span className="bg-indigo-50 text-[#4338CA] px-2.5 py-0.5 rounded-full font-bold">{group.subject}</span>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>{group.format === 'online' ? '💻 ออนไลน์' : '👥 นัดเจอ SPU'}</span>
                          <span className="rounded-full bg-slate-50 px-2 py-0.5">{group.current_members || 1}/{group.max_members || 5} คน</span>
                        </div>
                      </div>
                      <div><h3 className="font-bold text-slate-900 text-xs">{group.title}</h3><p className="text-[10px] text-slate-500 mt-0.5">{group.description}</p></div>
                      <div className="text-[10px] text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-indigo-500" /><span>{group.date_time}</span></div>
                        <div onClick={(e) => { e.stopPropagation(); handleViewLocationOnMap(group.location); }} className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors" title="ดูพิกัดบนแผนที่ 3D"><MapPin className="w-3 h-3 text-orange-500 shrink-0" /><span>{group.location}</span></div>
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">สร้างโดย: <b>{group.host_name}</b></span>
                        <button onClick={() => handleRequestJoinRoom(group)} className="bg-[#4338CA] text-white text-[10px] font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1">เข้าร่วมกลุ่มติว <ArrowRight className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAGE 2: REALTIME ROOM CHAT */}
            {currentTab === 'room_chat' && selectedGroup && (
              <div className="flex-1 min-h-0 flex flex-col bg-[#F8FAFC] relative overflow-hidden overscroll-contain pb-[60px]">
                <div className="bg-white px-4 pt-5 pb-3 border-b border-slate-200 shrink-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentTab('my_groups')} className="p-1 rounded-full hover:bg-slate-100"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
                      <div className="flex-1 min-w-0"><span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">● แชตสด Realtime</span><h2 className="font-bold text-slate-900 text-xs truncate mt-0.5">{selectedGroup.title}</h2></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setShowMemberListModal(true)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1 border border-indigo-100 relative">
                        <Users className="w-3.5 h-3.5" /> รายชื่อ {isHost(selectedGroup) && pendingMembers.length > 0 && <span className="w-2 h-2 bg-rose-500 rounded-full absolute -top-0.5 -right-0.5 animate-ping"></span>}
                      </button>
                      {isHost(selectedGroup) ? (
                        <>
                          <button onClick={handleOpenEditGroupModal} className="p-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={handleDeleteGroup} className="p-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 border border-rose-200" title="ยุบห้องติว"><Trash2 className="w-3.5 h-3.5" /></button>
                        </>
                      ) : (
                        <button onClick={() => handleLeaveGroup(selectedGroup)} className="p-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 border border-rose-200" title="ออกจากกลุ่ม"><LeaveIcon className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </div>

                  {isHost(selectedGroup) && pendingMembers.length > 0 && (
                    <div className="bg-[#EEF2FF] border border-indigo-200 p-3 rounded-2xl space-y-2 shadow-md">
                      <div className="flex items-center justify-between text-indigo-950 font-bold text-[11px]">
                        <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-indigo-600" /> คำขอเข้าร่วมห้องนี้ ({pendingMembers.length})</span>
                      </div>
                      {pendingMembers.map(m => (
                        <div key={m.id} className="bg-white/90 border border-indigo-100 p-2 rounded-xl flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={m.user_avatar || cartoonAvatars[0].url} className="w-7 h-7 rounded-full object-cover border bg-indigo-50" />
                            <span className="font-bold text-xs text-slate-900 truncate">{m.user_name}</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleApproveMember(m.id, 'accepted')} className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-0.5 hover:bg-emerald-700"><Check className="w-3 h-3" /> ยอมรับ</button>
                            <button onClick={() => handleApproveMember(m.id, 'rejected')} className="bg-rose-500 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-0.5 hover:bg-rose-600"><X className="w-3 h-3" /> ไม่ยอมรับ</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-indigo-50/90 to-slate-50 border border-indigo-100 rounded-2xl p-3 space-y-2 text-[10px]">
                    <div className="flex items-center justify-between border-b border-indigo-100/60 pb-1.5">
                      <span className="bg-[#4338CA] text-white px-2.5 py-0.5 rounded-md font-bold text-[9px]">{selectedGroup.subject || 'ติวทั่วไป'}</span>
                      <span className="text-slate-600 font-bold flex items-center gap-1"><Users className="w-3 h-3 text-indigo-600" /> สมาชิก ({selectedGroup.current_members || 1}/{selectedGroup.max_members || 5} คน)</span>
                    </div>
                    <div className="text-slate-600 leading-snug space-y-1"><p>{selectedGroup.description}</p><p className="text-[9px] text-slate-400 font-semibold">👑 หัวหน้าห้อง: <b className="text-slate-700">{selectedGroup.host_name}</b></p></div>
                    <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-indigo-100/40">
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-indigo-600" /><span>{selectedGroup.date_time}</span></div>
                      <button type="button" onClick={() => handleViewLocationOnMap(selectedGroup.location)} className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer text-left" title="ดูพิกัดบนแผนที่ 3D"><MapPin className="w-3 h-3 text-orange-500 shrink-0" /><span>{selectedGroup.location}</span></button>
                    </div>
                  </div>
                </div>

                <div
                  ref={roomChatContainerRef}
                  onScroll={handleRoomChatScroll}
                  style={{ backgroundImage: 'radial-gradient(ellipse at 14% 12%, rgba(199,210,254,.42), transparent 38%), radial-gradient(ellipse at 88% 82%, rgba(167,243,208,.3), transparent 34%), linear-gradient(145deg, #fbfcff 0%, #f4f6ff 52%, #f8fafc 100%)' }}
                  className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3 text-xs no-scrollbar"
                >
                  {newRoomMessagesCount > 0 && (
                    <div className="sticky top-1 z-20 -mb-8 flex justify-center">
                      <button type="button" onClick={() => roomChatContainerRef.current?.scrollTo({ top: roomChatContainerRef.current.scrollHeight, behavior: 'smooth' })} className="rounded-full bg-indigo-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg transition hover:bg-indigo-700">
                        ↓ {newRoomMessagesCount} ข้อความใหม่
                      </button>
                    </div>
                  )}
                  {isRoomChatLoading && roomChatMessages.length === 0 && (
                    <div className="flex min-h-full items-center justify-center">
                      <div className="rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-[11px] font-semibold text-slate-500 shadow-sm backdrop-blur-sm">
                        <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-indigo-500" />กำลังเปิดห้องแชต...
                      </div>
                    </div>
                  )}

                  {!isRoomChatLoading && roomChatLoadError && (
                    <div className="flex min-h-full items-center justify-center px-4 text-center">
                      <div className="rounded-2xl border border-rose-100 bg-white/85 px-5 py-4 text-[11px] text-rose-700 shadow-sm">
                        โหลดข้อความไม่สำเร็จ ลองออกจากห้องแล้วเข้าใหม่อีกครั้งนะ
                      </div>
                    </div>
                  )}

                  {!isRoomChatLoading && !roomChatLoadError && roomChatMessages.length === 0 && (
                    <div className="flex min-h-full flex-col items-center justify-center px-1 py-5 text-center">
                      <div className="bit-hero-mascot relative mb-1 grid h-[126px] w-[126px] place-items-center">
                        <span aria-hidden="true" className="absolute inset-2 rounded-full bg-indigo-200/45 blur-2xl" />
                        <StudyBuddyBit className="relative z-10 h-[118px] w-[108px]" mood="wave" />
                        <span aria-hidden="true" className="absolute right-3 top-2 text-lg text-amber-400 animate-pulse">✦</span>
                        <span aria-hidden="true" className="absolute bottom-5 left-2 text-xs text-indigo-300">✦</span>
                      </div>
                      <div className="w-full max-w-sm rounded-[24px] border border-white/90 bg-white/80 px-4 py-4 shadow-[0_12px_32px_rgba(79,70,229,0.08)] backdrop-blur-sm">
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-bold text-indigo-600"><Sparkles className="h-3 w-3" /> เริ่มต้นห้องติว</span>
                        <h3 className="text-sm font-extrabold text-slate-800">ห้องนี้ยังไม่มีข้อความ</h3>
                        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                          {isApprovedMember(selectedGroup) ? 'น้องบิตพร้อมช่วยเปิดบทสนทนาแล้ว ชวนเพื่อนเริ่มคุยกันได้เลย!' : 'รอหัวหน้าห้องอนุมัติก่อน แล้วค่อยมาร่วมพูดคุยกับเพื่อน ๆ นะ'}
                        </p>
                        {isApprovedMember(selectedGroup) && (
                          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                            {['👋 สวัสดีทุกคน', 'วันนี้ติวเรื่องอะไรกันดี?', 'สะดวกนัดติววันไหน?'].map((prompt) => (
                              <button
                                key={prompt}
                                type="button"
                                onClick={() => { setRoomChatMsg(prompt); roomChatInputRef.current?.focus(); }}
                                className="rounded-full border border-indigo-100 bg-white px-2.5 py-1.5 text-[9px] font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 active:translate-y-0"
                              >
                                {prompt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {roomChatMessages.map((m, index) => {
                    const isMe = m.sender_name === currentUser.name;
                    const isImage = m.text?.startsWith('[IMAGE]:');
                    const startsNewDay = index === 0 || getMessageDayKey(roomChatMessages[index - 1]?.created_at) !== getMessageDayKey(m.created_at);
                    return (
                      <React.Fragment key={m.id}>
                        {startsNewDay && (
                          <div className="flex justify-center py-1"><span className="rounded-full border border-white/90 bg-white/80 px-3 py-1 text-[9px] font-bold text-slate-500 shadow-sm">{formatMessageDayLabel(m.created_at)}</span></div>
                        )}
                        {String(m.id) === newRoomMessageMarkerId && (
                          <div className="flex items-center gap-2 py-1 text-[9px] font-bold text-rose-500"><span className="h-px flex-1 bg-rose-200" /><span>ข้อความใหม่</span><span className="h-px flex-1 bg-rose-200" /></div>
                        )}
                        <div className={`flex gap-2 ${isMe ? 'justify-end' : ''} ${String(m.id) === animatedRoomMessageId ? 'room-message-enter' : ''}`}>
                          {!isMe && <img src={m.sender_avatar || cartoonAvatars[0].url} className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 border bg-indigo-50" />}
                          <div className={`max-w-[78%] space-y-0.5 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[9px] text-slate-400 px-1">{m.sender_name}</span>
                            <div className={`p-3 rounded-2xl leading-relaxed ${isMe ? 'bg-[#4338CA] text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                              {isImage ? <img src={m.text.replace('[IMAGE]:', '')} className="rounded-xl max-h-48 object-cover" /> : m.text}
                            </div>
                            <span className="text-[8px] text-slate-400 px-1">{formatTime(m.created_at)}</span>
                          </div>
                          {isMe && <img src={currentUser.avatar} className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 border bg-indigo-50" />}
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {isApprovedMember(selectedGroup) ? (
                  <div className="bg-white p-2.5 border-t border-slate-200 flex items-center gap-2 shrink-0 z-10">
                    <label className="p-2 text-slate-500 hover:text-indigo-600 cursor-pointer">
                      <Paperclip className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={(e) => handleChatFileUpload(e, false)} className="hidden" />
                    </label>
                    <input ref={roomChatInputRef} type="text" value={roomChatMsg} onChange={(e) => setRoomChatMsg(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendRoomMsg(); }} placeholder="พิมพ์ข้อความ..." className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2 text-xs outline-none" />
                    <button type="button" aria-label="ส่งข้อความ" onClick={() => handleSendRoomMsg()} className="group bg-[#4338CA] text-white p-2 rounded-xl shadow-sm transition hover:bg-indigo-700 active:scale-90">
                      <Send className={`h-4 w-4 transition-transform ${isRoomSendAnimating ? 'room-plane-send' : 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'}`} />
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-3 border-t border-amber-200 text-center text-amber-800 text-xs font-bold shrink-0 z-10">
                    🔒 คุณต้องได้รับการอนุมัติจากหัวหน้าห้องก่อนจึงจะสามารถพิมพ์คุยได้
                  </div>
                )}
              </div>
            )}

            {/* PAGE 2.5: PRIVATE CHAT */}
            {currentTab === 'private_chat' && activePrivateMember && (
              <div className="flex-1 flex flex-col bg-[#F8FAFC] relative overflow-hidden pb-[60px]">
                <div className="bg-white px-4 pt-5 pb-3 border-b border-slate-200 shrink-0 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setCurrentTab('my_groups')} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700"><ArrowLeft className="w-5 h-5" /></button>
                    <div className="relative">
                      <img src={activePrivateMember.avatar || cartoonAvatars[0].url} alt={activePrivateMember.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-indigo-50" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5"><h2 className="font-bold text-slate-900 text-xs leading-tight truncate">{activePrivateMember.name}</h2><GenderBadge gender={activePrivateMember.gender} /></div>
                      <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">● ออนไลน์</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnfriend(activePrivateMember.id)}
                    className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-xl shrink-0 ml-2 transition active:scale-95 shadow-2xs"
                    title="ลบเพื่อน"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>ลบเพื่อน</span>
                  </button>
                </div>

                <div ref={privateChatContainerRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3 text-xs no-scrollbar">
                  {privateMessages.map((pm, index) => {
                    const isMe = pm.sender_id === user?.id;
                    const isImage = pm.text?.startsWith('[IMAGE]:');

                    return (
                      <div key={pm.id || index} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && <img src={activePrivateMember.avatar || cartoonAvatars[0].url} className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 border bg-indigo-50" />}
                        <div className={`max-w-[78%] space-y-0.5 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`p-3 rounded-2xl leading-relaxed ${isMe ? 'bg-[#4338CA] text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                            {isImage ? <img src={pm.text.replace('[IMAGE]:', '')} className="rounded-xl max-h-48 object-cover" /> : pm.text}
                          </div>
                          <span className="text-[8px] text-slate-400 px-1">{formatTime(pm.created_at)}</span>
                        </div>
                        {isMe && <img src={currentUser.avatar} className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 border bg-indigo-50" />}
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <div className="bg-white p-2.5 border-t border-slate-200 flex items-center gap-2 shrink-0 z-10">
                  <label className="p-2 text-slate-500 hover:text-indigo-600 cursor-pointer">
                    <Paperclip className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={(e) => handleChatFileUpload(e, true)} className="hidden" />
                  </label>
                  <input type="text" value={privateMsgInput} onChange={(e) => setPrivateMsgInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendPrivateMsg(); }} placeholder="พิมพ์ข้อความส่วนตัว..." className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2 text-xs outline-none" />
                  <button onClick={() => handleSendPrivateMsg()} className="bg-[#4338CA] text-white p-2 rounded-xl"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {/* PAGE 3: CHATS LIST HUB */}
            {currentTab === 'my_groups' && (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4 no-scrollbar pb-32 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <div><h2 className="text-xl font-bold text-slate-900 pt-1">รายการแชตทั้งหมด 📚💬</h2><p className="text-xs text-slate-500">รวมทั้งห้องติวและแชตส่วนตัวกับเพื่อน</p></div>
                  <StudyBuddyBit className="h-14 w-12 shrink-0" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input type="text" value={friendSearchTerm} onChange={(e) => setFriendSearchTerm(e.target.value)} placeholder="ค้นหาชื่อเพื่อน..." className="w-full text-xs outline-none bg-transparent" />
                </div>

                {friendRequests.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 space-y-2">
                    <span className="text-[10px] font-bold text-indigo-900 block">👋 คำขอเป็นเพื่อนใหม่ ({friendRequests.length})</span>
                    {friendRequests.map(req => (
                      <div key={req.id} className="bg-white p-2 rounded-xl flex items-center justify-between border border-indigo-100">
                        <span className="text-xs font-bold text-slate-800">{req.sender_name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRejectFriendRequest(req.id)}
                            className="border border-slate-200 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
                          >
                            ปฏิเสธ
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptFriendRequest(req)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition"
                          >
                            <Check className="w-3 h-3" /> ยอมรับ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">📢 ห้องติวของฉัน</span>
                  {isGroupsLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-500">กำลังโหลดกลุ่มติว...</div>
                  ) : groupsLoadError && studyGroups.length === 0 ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-center">
                      <p className="text-xs font-semibold text-rose-700">โหลดกลุ่มติวไม่สำเร็จ</p>
                      <button onClick={() => { setIsGroupsLoading(true); fetchGroupsFromSupabase(); }} className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-rose-700 ring-1 ring-rose-200">ลองอีกครั้ง</button>
                    </div>
                  ) : myJoinedGroups.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-indigo-200 bg-white px-4 py-6 text-center shadow-xs">
                      <div className="mx-auto mb-2 flex h-[88px] w-[88px] items-center justify-center">
                        <StudyBuddyBit className="h-[84px] w-[76px]" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">ยังไม่มีกลุ่มติวของคุณ</h3>
                      <p className="mx-auto mt-1 max-w-[230px] text-[11px] leading-relaxed text-slate-500">
                        ลองค้นหาห้องที่สนใจ หรือสร้างห้องชวนเพื่อนมาอ่านด้วยกัน
                      </p>
                      <div className="mt-4 flex justify-center gap-2">
                        <button onClick={() => setCurrentTab('home')} className="rounded-xl bg-[#4338CA] px-3 py-2 text-[11px] font-bold text-white">
                          <Search className="mr-1 inline h-3.5 w-3.5" /> ค้นหาห้อง
                        </button>
                        <button onClick={() => { setIsEditingGroup(false); setCurrentTab('create'); }} className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-[11px] font-bold text-indigo-700">
                          <Plus className="mr-1 inline h-3.5 w-3.5" /> สร้างห้อง
                        </button>
                      </div>
                    </div>
                  ) : myJoinedGroups.map((group) => {
                    const groupPreview = recentGroupMessages[group.id]; const isUnread = groupPreview?.unread;
                    return (
                      <div key={`group-${group.id}`} onClick={() => handleRequestJoinRoom(group)} className={`bg-white border rounded-2xl p-3.5 shadow-xs cursor-pointer flex items-center justify-between ${isUnread ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0"><Users className="w-5 h-5" /></div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center mb-0.5"><h3 className={`text-xs truncate ${isUnread ? 'font-black text-indigo-950' : 'font-bold text-slate-900'}`}>{group.title}</h3><span className="text-[9px] text-slate-400">{groupPreview?.time || ''}</span></div>
                            <p className={`text-[11px] truncate ${isUnread ? 'font-bold text-indigo-700' : 'text-slate-500'}`}>{groupPreview?.text || group.description || 'คลิกเพื่อเข้าสู่ห้องติว'}</p>
                          </div>
                        </div>
                        {isUnread && <span className="w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white shrink-0 animate-pulse"></span>}
                      </div>
                    );
                  })}

                  <span className="text-[11px] font-bold text-slate-400 block uppercase pt-2">💬 แชตส่วนตัวกับเพื่อน</span>
                  {sortedAcceptedFriends.map((usr) => {
                    const fName = (usr.display_name || usr.email.split('@')[0]).replace(/\s*\(นักศึกษา SPU\)/g, '');
                    const dmPreview = recentDMMessages[usr.id];
                    const isUnread = dmPreview?.unread;
                    return (
                      <div key={`friend-${usr.id}`} onClick={() => handleOpenPrivateChat({ id: usr.id, name: fName, avatar: usr.avatar })} className={`bg-white border rounded-2xl p-3.5 shadow-xs cursor-pointer flex items-center justify-between ${isUnread ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                          <div className="relative shrink-0">
                            <img src={usr.avatar || cartoonAvatars[0].url} className="w-11 h-11 rounded-full object-cover border border-slate-200 bg-indigo-50" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                              <h4 className={`text-xs truncate ${isUnread ? 'font-black text-indigo-950' : 'font-bold text-slate-900'}`}>{fName}</h4>
                              <span className="text-[9px] text-slate-400">{dmPreview?.time || ''}</span>
                            </div>
                            <p className={`text-[11px] truncate ${isUnread ? 'font-bold text-indigo-900' : 'text-slate-500'}`}>{dmPreview?.text || 'คลิกเพื่อเปิดหน้าต่างแชตส่วนตัว'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isUnread && (
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-bold text-rose-500">ข้อความใหม่</span>
                              <span className="w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white shrink-0 animate-pulse"></span>
                            </div>
                          )}
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><MessageCircle className="w-4 h-4" /></div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnfriend(usr.id);
                            }}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="ลบเพื่อน"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PAGE 5: SCHEDULE */}
            {currentTab === 'schedule' && (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4 no-scrollbar pb-32">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900 pt-1">ตารางนัดติวของฉัน 📅</h2>
                  <StudyBuddyBit className="h-14 w-12 shrink-0" />
                </div>
                <div className="space-y-3 pt-2">
                  {isGroupsLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-500">กำลังโหลดตารางนัด...</div>
                  ) : groupsLoadError && studyGroups.length === 0 ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-center">
                      <p className="text-xs font-semibold text-rose-700">โหลดตารางนัดไม่สำเร็จ</p>
                      <button onClick={() => { setIsGroupsLoading(true); fetchGroupsFromSupabase(); }} className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-rose-700 ring-1 ring-rose-200">ลองอีกครั้ง</button>
                    </div>
                  ) : myJoinedGroups.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-indigo-200 bg-white px-5 py-8 text-center shadow-sm">
                      <div className="mx-auto mb-2 flex h-[92px] w-[92px] items-center justify-center">
                        <StudyBuddyBit className="h-[88px] w-[80px]" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">ยังไม่มีนัดติว</h3>
                      <p className="mx-auto mt-1 max-w-[230px] text-xs leading-relaxed text-slate-500">
                        เมื่อคุณเข้าร่วมหรือสร้างกลุ่ม นัดติวจะปรากฏในหน้านี้
                      </p>
                      <button onClick={() => setCurrentTab('home')} className="mt-4 rounded-xl bg-[#4338CA] px-4 py-2.5 text-xs font-bold text-white">
                        <Search className="mr-1.5 inline h-3.5 w-3.5" /> ค้นหากลุ่มติว
                      </button>
                    </div>
                  ) : myJoinedGroups.map((group) => (
                    <div key={group.id} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-2.5">
                      <div className="flex justify-between items-center"><span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full">● นัดหมายยืนยันแล้ว</span><span className="text-[10px] font-bold text-indigo-600">{group.subject}</span></div>
                      <h3 className="font-bold text-slate-900 text-xs">{group.title}</h3>
                      <div className="bg-slate-50 p-2.5 rounded-2xl space-y-1 text-[10px] text-slate-600">
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-600" /><span className="font-semibold text-slate-800">{group.date_time}</span></div>
                        <div onClick={() => handleViewLocationOnMap(group.location)} className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors" title="ดูพิกัดบนแผนที่ 3D"><MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" /><span>{group.location}</span></div>
                      </div>
                      <div className="pt-1 flex justify-between items-center border-t border-slate-100">
                        {isHost(group) ? (
                          <button onClick={() => handleCancelSchedule(group)} className="bg-rose-50 text-rose-600 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-rose-100 flex items-center gap-1"><X className="w-3.5 h-3.5" /> ยกเลิก/ลบห้องติว</button>
                        ) : (
                          <button onClick={() => handleLeaveGroup(group)} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"><LeaveIcon className="w-3.5 h-3.5" /> ออกจากกลุ่ม</button>
                        )}
                        <button onClick={() => handleRequestJoinRoom(group)} className="bg-[#4338CA] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl">เข้าห้องแชต</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAGE 6: CREATE/EDIT GROUP */}
            {currentTab === 'create' && (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 pb-32 space-y-4 no-scrollbar">
                <div>
                  <span className="bg-indigo-50 text-[#4338CA] text-[10px] px-2.5 py-1 rounded-full font-bold">🌍 ติวได้ทุกวิชา/ทุกภาษา</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{isEditingGroup ? 'แก้ไขข้อมูลห้องติว ✏️' : 'สร้างห้องติวใหม่ 📚'}</h2>
                </div>
                <div className="space-y-3">
                  <div><label className="text-xs font-bold text-slate-700">ชื่อวิชา / หัวข้อที่อยากติว *</label><input type="text" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} placeholder="เช่น IELTS, Calculus I" className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs mt-1 outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-700">ชื่อห้อง / หัวข้อย่อย *</label><input type="text" value={groupTitle} onChange={(e) => setGroupTitle(e.target.value)} placeholder="เช่น ตะลุยโจทย์ Reading" className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs mt-1 outline-none" /></div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">เลือกหมวดหมู่</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs mt-1 outline-none">
                      <option value="ภาษาต่างประเทศ">ภาษาต่างประเทศ</option><option value="วิชาการ">วิชาการ/มหาวิทยาลัย</option><option value="เทคโนโลยี/ไอที">เทคโนโลยี/ไอที</option><option value="ทักษะทั่วไป">ทักษะทั่วไป (Soft Skills)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700">วันที่นัดติว</label>
                      <input type="date" value={groupDate} onChange={(e) => setGroupDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-xs mt-1 outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">ช่วงเวลาติว</label>
                      <select value={groupTime} onChange={(e) => setGroupTime(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-xs mt-1 outline-none">
                        <option value="09:00 - 12:00 น.">09:00 - 12:00 น.</option>
                        <option value="13:00 - 15:00 น.">13:00 - 15:00 น.</option>
                        <option value="15:00 - 17:00 น.">15:00 - 17:00 น.</option>
                        <option value="17:00 - 19:00 น.">17:00 - 19:00 น.</option>
                        <option value="__custom__">กำหนดเอง (ระบุเวลาเอง)</option>
                      </select>
                      {groupTime === '__custom__' && (
                        <input
                          type="text"
                          value={customGroupTime}
                          onChange={(e) => setCustomGroupTime(e.target.value)}
                          placeholder="ระบุเวลา เช่น 18:30 - 20:30 น."
                          className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-xs mt-2 outline-none"
                        />
                      )}
                    </div>
                  </div>

                  <div><label className="text-xs font-bold text-slate-700">จำนวนรับสูงสุด (คน)</label><input type="number" min="2" max="20" value={maxMembersInput} onChange={(e) => setMaxMembersInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs mt-1 outline-none" /></div>

                  <div><label className="text-xs font-bold text-slate-700">รายละเอียดเพิ่มเติม</label><textarea value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} placeholder="รายละเอียดเพิ่มเติม..." className="w-full bg-[#FFFFFF] border border-slate-200 rounded-2xl p-3 text-xs mt-1 outline-none h-20" /></div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">พิกัดจุดนัดพบ (SPU Hub)</label>
                    <select
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs mt-1 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    >
                      <option value="อาคาร 11 ชั้น 5 (สำนักหอสมุด SPU)">อาคาร 11 ชั้น 5 (สำนักหอสมุด SPU)</option>
                      <option value="อาคาร 5 ชั้น 8 (คณะ IT SPU)">อาคาร 5 ชั้น 8 (คณะ IT SPU)</option>
                      <option value="อาคาร 9">อาคาร 9</option>
                      <option value="Google Meet (ออนไลน์)">Google Meet (ออนไลน์)</option>
                      <option value="other">อื่นๆ (ระบุสถานที่เอง)</option>
                    </select>

                    {locationText === 'other' && (
                      <div className="mt-2.5 space-y-1">
                        <label className="text-[11px] font-semibold text-indigo-700 block">
                          📍 ระบุสถานที่นัดพบเอง <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          placeholder="ระบุสถานที่นัดพบ เช่น ร้านกาแฟหน้ามอ, ตึก 1 ชั้น 2, Discord..."
                          className="w-full bg-white border border-indigo-200 rounded-2xl p-3 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
                        />
                      </div>
                    )}
                  </div>
                  <button onClick={handleSaveGroup} className="w-full bg-[#4338CA] text-white font-bold py-3 rounded-2xl text-xs mt-2">{isEditingGroup ? 'บันทึกการแก้ไข' : 'ยืนยันสร้างห้องติว'}</button>
                </div>
              </div>
            )}

            {/* PAGE 7: MAP PAGE (ปรับปรุงซ่อน Overlay ด้านล่างอย่างสมบูรณ์) */}
            {currentTab === 'map_page' && (
              <div ref={mapPageScrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3 pb-32">
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentTab('home')} className="p-1 rounded-full hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                  </button>
                  <h2 className="text-lg font-bold text-slate-900">แผนที่จุดนัดพบ SPU Hub</h2>
                </div>
                <p className="px-1 text-[10px] text-slate-500">เลื่อนล้อเมาส์เพื่อดูรายละเอียดด้านล่าง · เลื่อนสุดแล้วล้อเมาส์จะซูมแผนที่</p>
                <div className="bg-white border border-slate-200 rounded-3xl p-3 space-y-3 shadow-xs">
                  {/* ซ่อนกล่องล่าง Overlay ของ Campus Floor Explorer */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-[min(80dvh,720px)] min-h-[480px] relative">
                    <button
                      type="button"
                      onClick={() => {
                        const mapFrame = mapIframeRef.current;
                        if (!mapFrame?.requestFullscreen) {
                          notifyUser('เบราว์เซอร์นี้ไม่รองรับการขยายแผนที่เต็มจอ', 'error');
                          return;
                        }
                        mapFrame.requestFullscreen().catch(() => {
                          notifyUser('ขยายแผนที่เต็มจอไม่สำเร็จ', 'error');
                        });
                      }}
                      className="absolute left-2 top-2 z-10 rounded-xl border border-white/30 bg-slate-950/85 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur"
                      aria-label="ขยายแผนที่เต็มหน้าจอ"
                    >
                      ⛶ เต็มจอ
                    </button>
                    <iframe
                      ref={mapIframeRef}
                      src="/campus-map.html"
                      title="แผนที่แคมปัส 3D และจุดนัดติว SPU"
                      loading="lazy"
                      allow="fullscreen"
                      onLoad={() => {
                        try {
                          const iframeDoc = mapIframeRef.current?.contentDocument || mapIframeRef.current?.contentWindow?.document;
                          if (iframeDoc) {
                            if (mapIframeWheelHandlerRef.current) {
                              iframeDoc.removeEventListener('wheel', mapIframeWheelHandlerRef.current, true);
                            }
                            mapIframeWheelHandlerRef.current = (event) => {
                              const scrollContainer = mapPageScrollRef.current;
                              if (!scrollContainer) return;
                              const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                              const canScroll = event.deltaY > 0
                                ? scrollContainer.scrollTop < maxScrollTop - 1
                                : scrollContainer.scrollTop > 0;
                              if (!canScroll) return;
                              event.preventDefault();
                              event.stopImmediatePropagation();
                              scrollContainer.scrollBy({ top: event.deltaY, behavior: 'auto' });
                            };
                            iframeDoc.addEventListener('wheel', mapIframeWheelHandlerRef.current, { capture: true, passive: false });
                            const style = iframeDoc.createElement('style');
                            style.textContent = `
                              #floor-explode-panel,
                              .floor-explorer-overlay, 
                              #campus-floor-explorer, 
                              .floor-selector-panel { 
                                display: none !important; 
                              }
                            `;
                            iframeDoc.head.appendChild(style);

                            // นำทางแผนที่ไปยังพิกัดที่เลือกไว้ (เช่น อาคาร 9 หรือสถานที่ที่เลือก)
                            if (selectedMapLocation && iframeDoc.defaultView?.navigateToLocation) {
                              setTimeout(() => {
                                iframeDoc.defaultView.navigateToLocation(selectedMapLocation);
                              }, 300);
                            }
                          }
                        } catch (e) {
                          console.log('Cross-origin restriction handled');
                        }
                      }}
                      className="w-full h-full border-0"
                    />
                  </div>
                  <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-indigo-900 text-xs block">📍 จุดนัดติวยอดนิยม SPU Hub</span>
                    <p className="text-[10px] text-slate-600 font-medium">● อาคาร 11: ชั้น 1 True Coffee & ชั้น 5 หอสมุด SPU</p>
                    <p className="text-[10px] text-slate-600 font-medium">● อาคาร 5: ชั้น 8 คณะ IT SPU & อาคารสยามบรมราชกุมารี</p>
                    <p className="text-[10px] text-slate-600 font-medium">● อาคาร 9: อาคารเรียนรวมและพื้นที่กิจกรรมนักศึกษา</p>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 8: PROFILE */}
            {currentTab === 'profile' && (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 pb-32 space-y-4 no-scrollbar pt-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2"><button onClick={() => setCurrentTab('home')} className="p-1 rounded-full hover:bg-slate-100"><ArrowLeft className="w-5 h-5 text-slate-700" /></button><h2 className="text-lg font-bold text-slate-900">โปรไฟล์ผู้ใช้งาน</h2></div>
                <div className="bg-white border border-slate-200 rounded-3xl p-5 text-center space-y-3 shadow-sm">
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    aria-label="แตะเพื่อเปลี่ยนรูปโปรไฟล์"
                    className="group relative block w-20 h-20 mx-auto rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                  >
                    <img src={currentUser.avatar} alt="" className="w-20 h-20 rounded-full border-4 border-indigo-100 object-cover bg-indigo-50" />
                    <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-sm">
                      <Camera className="h-3.5 w-3.5" />
                    </span>
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>เปลี่ยนรูปโปรไฟล์</span>
                    </button>
                  </div>
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="เลือกรูปโปรไฟล์"
                  />
                  <div><h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2><p className="text-xs text-indigo-600 font-semibold">{user ? user.email : 'ไม่ได้เข้าสู่ระบบ'}</p></div>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-2.5 shadow-sm text-xs">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">เพศของผู้ใช้งาน (Gender)</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleGenderChange('ชาย')} className={`flex-1 py-2.5 rounded-xl font-bold border ${selectedGender === 'ชาย' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'}`}>👦 ชาย</button>
                    <button onClick={() => handleGenderChange('หญิง')} className={`flex-1 py-2.5 rounded-xl font-bold border ${selectedGender === 'หญิง' ? 'bg-pink-600 text-white' : 'bg-slate-50 text-slate-600'}`}>👧 หญิง</button>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3 text-xs">
                  <div><label className="text-[10px] font-bold text-slate-500 block mb-1">ชื่อเล่น / Display Name</label><input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-slate-500 block mb-1">คณะ / ชั้นปี</label><input type="text" value={faculty} onChange={(e) => setFaculty(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none" /></div>
                  <button onClick={handleSaveProfile} className="w-full bg-[#4338CA] text-white font-bold py-2.5 rounded-xl text-xs">{isSavedProfile ? 'บันทึกสำเร็จแล้ว!' : 'บันทึกการเปลี่ยนแปลง'}</button>
                </div>
                <button onClick={handleLogout} className="w-full bg-rose-50 text-rose-600 font-bold py-3 rounded-2xl text-xs border border-rose-100 flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> ออกจากระบบ (Logout)</button>
              </div>
            )}

            {/* FLOATING ACTION BUTTON */}
            {currentTab === 'home' && (
              <button onClick={() => { setIsEditingGroup(false); setCurrentTab('create'); }} className="absolute bottom-16 right-4 bg-[#4338CA] text-white shadow-lg rounded-2xl px-4 py-3 text-xs font-semibold flex items-center gap-1.5 z-20">
                <Plus className="w-4 h-4" /> สร้างห้องติว
              </button>
            )}

            {/* BOTTOM NAVIGATION */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2.5 flex justify-between items-center text-[10px] font-medium z-20 shadow-lg">
              <button onClick={() => setCurrentTab('home')} className={`flex flex-col items-center gap-0.5 ${currentTab === 'home' ? 'text-[#4338CA] font-bold' : 'text-slate-400'}`}><Compass className="w-4 h-4" /><span>ค้นหาห้อง</span></button>
              <button onClick={() => setCurrentTab('my_groups')} className={`flex flex-col items-center gap-0.5 ${currentTab === 'my_groups' || currentTab === 'private_chat' ? 'text-[#4338CA] font-bold' : 'text-slate-400'}`}><MessageCircle className="w-4 h-4" /><span>ห้องของฉัน</span></button>
              <button onClick={() => setCurrentTab('schedule')} className={`flex flex-col items-center gap-0.5 ${currentTab === 'schedule' ? 'text-[#4338CA] font-bold' : 'text-slate-400'}`}><Calendar className="w-4 h-4" /><span>ตารางนัด</span></button>
              <button onClick={() => { setIsEditingGroup(false); setCurrentTab('create'); }} className={`flex flex-col items-center gap-0.5 ${currentTab === 'create' ? 'text-[#4338CA] font-bold' : 'text-slate-400'}`}><Plus className="w-4 h-4" /><span>สร้างห้อง</span></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
