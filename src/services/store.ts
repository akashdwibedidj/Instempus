import { create } from 'zustand';
import {
  UserProfile,
  Role,
  GatePass,
  NoticePost,
  CampusIssue,
  ServiceApplication,
  ChatMessage,
  ChatThread,
  AuditLogItem,
  Language,
  TeacherClass,
  CanteenDailyMenu,
  EmergencyAlert,
} from '../types';

export const DEMO_PROFILES: Record<Role, UserProfile> = {
  student: {
    id: 'usr_student_01',
    name: 'Arya Pattnayak',
    username: 'arya_pattnayak',
    role: 'student',
    rollNo: '2501CSE008',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 6,
    section: 'A',
    hostelBlock: 'Hostel Block A (Bhabha Bhawan)',
    roomNo: 'Room A-204',
    phone: '+91 98610 54321',
    email: 'arya.pattnayak@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    thoughtNote: 'Mid-semester laboratory practical preparation in progress',
    languagePref: 'en',
  },
  teacher: {
    id: 'usr_teacher_01',
    name: 'Prof. Sneha Mohanty',
    username: 'prof_sneha_cse',
    role: 'teacher',
    employeeId: 'EMP-CSE-042',
    department: 'Computer Science and Engineering',
    phone: '+91 94371 88990',
    email: 'sneha.mohanty@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    thoughtNote: 'Consultation hours: 15:00 to 17:00 at Aryabhatta Hall 304',
    languagePref: 'en',
    digitalSignature: 'Prof. Sneha Mohanty (Faculty Mentor, CSE)',
  },
  hod: {
    id: 'usr_hod_01',
    name: 'Dr. Rajesh Senapati',
    username: 'hod_cse_official',
    role: 'hod',
    employeeId: 'EMP-HOD-007',
    department: 'Computer Science and Engineering',
    phone: '+91 94370 12345',
    email: 'hod.cse@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    thoughtNote: 'Departmental Academic Council meeting scheduled for 10:00 AM',
    languagePref: 'en',
    digitalSignature: 'Dr. Rajesh Senapati, Ph.D. — Head of Department, CSE',
  },
  warden: {
    id: 'usr_warden_01',
    name: 'Mr. Niranjan Sahu',
    username: 'warden_block_a',
    role: 'warden',
    employeeId: 'EMP-WRD-012',
    department: 'Hostel Administration',
    hostelBlock: 'Hostel Block A (Bhabha Bhawan)',
    phone: '+91 99372 90123',
    email: 'warden.blocka@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    thoughtNote: 'Curfew deadline strictly enforced at 20:30 hours',
    languagePref: 'en',
    digitalSignature: 'Mr. Niranjan Sahu — Chief Warden, Hostel Block A',
  },
  security: {
    id: 'usr_sec_01',
    name: 'Pradeep Rout',
    username: 'security_gate_1',
    role: 'security',
    employeeId: 'SEC-GATE-01',
    department: 'Campus Security Services',
    phone: '+91 98533 11223',
    email: 'security.gate1@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    thoughtNote: 'Main Gate 1 optical scanners calibrated',
    languagePref: 'en',
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Dr. A. K. Nayak',
    username: 'instempus_admin',
    role: 'admin',
    employeeId: 'ADMIN-CHIEF-01',
    department: 'Dean of Student Affairs and Operations',
    phone: '+91 94370 99887',
    email: 'dean.studentaffairs@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    thoughtNote: 'Campus systems operational at normal capacity',
    languagePref: 'en',
    digitalSignature: 'Dean of Student Affairs — Instempus Central Seal',
  },
  canteen: {
    id: 'usr_canteen_01',
    name: 'Gopal Sahoo',
    username: 'central_mess_02',
    role: 'canteen',
    employeeId: 'CNT-MESS-02',
    department: 'Canteen and Mess Board',
    phone: '+91 99380 44556',
    email: 'mess.manager@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    languagePref: 'en',
  },
  accounts: {
    id: 'usr_acc_01',
    name: 'Sasmita Mishra',
    username: 'accounts_bput',
    role: 'accounts',
    employeeId: 'ACC-FIN-09',
    department: 'Finance and Student Accounts',
    phone: '+91 94378 22334',
    email: 'accounts.officer@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    languagePref: 'en',
  },
  principal: {
    id: 'usr_prin_01',
    name: 'Prof. (Dr.) B. C. Panda',
    username: 'principal_director',
    role: 'principal',
    employeeId: 'DIR-PRIN-01',
    department: 'Office of the Director / Principal',
    phone: '+91 94370 00001',
    email: 'principal@bput.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    languagePref: 'en',
    digitalSignature: 'Prof. (Dr.) B. C. Panda — Principal and Director',
  },
};

const INITIAL_CANTEEN_MENU: CanteenDailyMenu = {
  date: 'Today (October 1, 2026)',
  breakfast: 'Idli, Sambar, Coconut Chutney & Tea / Milk',
  lunch: 'Steamed Rice, Dalma, Paneer Butter Masala, Papad & Salad',
  snacks: 'Vegetable Samosa with Green Chutney & Coffee',
  dinner: 'Tandoori Roti, Kadai Paneer / Egg Curry, Jeera Rice & Kheer',
  specialDish: 'Odisha Special Dalma & Kheer',
  isVegOnly: false,
  postedBy: 'Gopal Sahoo (Canteen Manager)',
  lastUpdated: '07:15 AM today',
};

const INITIAL_EMERGENCY_ALERT: EmergencyAlert = {
  active: false,
  type: 'fire',
  title: 'Campus Emergency Protocol',
  message: 'Evacuate academic buildings immediately via designated fire exit staircases.',
  issuedAt: '',
  issuedBy: '',
  musterPoint: 'Central Convocation Sports Field Ground',
  emergencyPhone: '+91 98533 11223',
};

const INITIAL_TEACHER_CLASSES: TeacherClass[] = [
  {
    id: 'cls_01',
    subjectCode: 'CS601',
    subjectName: 'Distributed Systems & Cloud Computing',
    semester: 6,
    section: 'A',
    totalStudents: 60,
    timeSlot: '10:00 AM - 11:00 AM',
    room: 'Aryabhatta Block - Hall 301',
    lastAttendanceDate: '2026-10-01',
    lastAttendanceSlot: 'Period 2 (10:00 AM - 11:00 AM)',
    attendanceRate: 94.2,
    students: [
      { rollNo: '2501CSE001', name: 'Aarav Sharma', present: true },
      { rollNo: '2501CSE002', name: 'Aditi Mohapatra', present: true },
      { rollNo: '2501CSE003', name: 'Ananya Dash', present: true },
      { rollNo: '2501CSE004', name: 'Priya Nayak', present: true },
      { rollNo: '2501CSE008', name: 'Arya Pattnayak', present: true },
      { rollNo: '2501CSE015', name: 'Rohan Verma', present: false },
      { rollNo: '2501CSE018', name: 'Subham Biswal', present: true },
    ],
  },
  {
    id: 'cls_02',
    subjectCode: 'CS602',
    subjectName: 'Compiler Design Lab',
    semester: 6,
    section: 'A',
    totalStudents: 30,
    timeSlot: '02:00 PM - 05:00 PM',
    room: 'Advanced Software Lab 4',
    lastAttendanceDate: '2026-09-30',
    lastAttendanceSlot: 'Lab Slot (02:00 PM - 05:00 PM)',
    attendanceRate: 91.8,
    students: [
      { rollNo: '2501CSE001', name: 'Aarav Sharma', present: true },
      { rollNo: '2501CSE004', name: 'Priya Nayak', present: true },
      { rollNo: '2501CSE008', name: 'Arya Pattnayak', present: true },
      { rollNo: '2501CSE015', name: 'Rohan Verma', present: true },
    ],
  },
];

const INITIAL_GATE_PASSES: GatePass[] = [];

const INITIAL_NOTICES: NoticePost[] = [
  {
    id: 'notif_001',
    authorName: 'Gopal Sahoo',
    authorRole: 'canteen',
    authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    authorTitle: 'Manager, Canteen and Dining Board',
    title: 'Daily Mess Menu Update for October 1, 2026',
    content:
      'Breakfast: Idli, Sambar, Coconut Chutney.\nLunch: Dalma, Paneer Butter Masala, Rice & Salad.\nSnacks: Samosa & Tea.\nDinner: Tandoori Roti, Kadai Paneer / Egg Curry, Rice & Kheer.',
    groupName: 'Campus Canteen and Mess Menu',
    targetGroup: 'Campus Canteen and Mess Menu',
    tags: ['#canteen', '#mess-menu', '#dining'],
    timestamp: '1 hour ago',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    gotItCount: 198,
    userGotIt: true,
    commentsCount: 6,
  },
  {
    id: 'notif_002',
    authorName: 'Mr. Niranjan Sahu',
    authorRole: 'warden',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    authorTitle: 'Chief Warden, Hostel Block A',
    title: 'Strict Gate Curfew and Biometric Timings Protocol',
    content:
      'All resident scholars of Hostel Block A are hereby instructed that day-out gate passes expire strictly at 20:30 hours. Scholars returning past 20:30 hours without written authorization will have gate passes flagged in the institutional audit ledger. Parent notification is automatically dispatched at 20:45 hours.',
    groupName: 'Hostel Block A Residents',
    targetGroup: 'Hostel Block A Residents',
    tags: ['#hostel-a', '#gate-pass', '#curfew', '#regulations'],
    timestamp: '2 hours ago',
    isUrgent: true,
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    reelImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80',
    gotItCount: 148,
    userGotIt: true,
    commentsCount: 12,
  },
  {
    id: 'notif_003',
    authorName: 'Dr. Rajesh Senapati',
    authorRole: 'hod',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorTitle: 'Head of Department, CSE',
    title: 'High Performance Computing Lab 4 Allocation for Regional Finals',
    content:
      'Teams selected for the Regional Hackathon Finals are allocated High Performance Software Lab 4 with continuous 1Gbps fiber connectivity starting at 18:00 hours. Gate pass exemptions for overnight technical work are pre-endorsed for verified team members.',
    groupName: 'Computer Science 6th Semester',
    targetGroup: 'Computer Science 6th Semester',
    tags: ['#cse-dept', '#hackathon', '#bput2026', '#labs'],
    timestamp: '4 hours ago',
    isUrgent: true,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    reelImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    gotItCount: 312,
    userGotIt: false,
    commentsCount: 24,
    attachments: [
      { name: 'Lab4_Slot_Matrix_Official.pdf', size: '1.4 MB', type: 'pdf' },
    ],
  },
];

const INITIAL_ISSUES: CampusIssue[] = [
  {
    id: 'ISS-401',
    title: 'East wing corridor circuit breaker tripping during morning hours',
    description: 'Between 06:30 and 07:15 hours, activating the east wing water heating line trips circuit breaker DB-2 on the second floor distribution board.',
    category: 'hostel',
    location: 'Hostel Block A, 2nd Floor East Wing',
    authorName: 'Arya Pattnayak',
    authorRollNo: '2501CSE008',
    createdAt: 'Today, 08:30 AM',
    upvotes: 24,
    userUpvoted: true,
    status: 'in_progress',
    statusUpdateNote: 'Electrician assigned by Warden Niranjan Sahu. Inspection scheduled for 16:30 hours today.',
    assignedTo: 'Estate Electrical Maintenance',
  },
];

const INITIAL_APPLICATIONS: ServiceApplication[] = [
  {
    id: 'APP-9921',
    type: 'bonafide',
    title: 'Bonafide Certificate for National Scholarship Portal Verification',
    studentName: 'Arya Pattnayak',
    rollNo: '2501CSE008',
    submittedAt: 'Yesterday, 11:30 AM',
    status: 'approved',
    currentApproverRole: 'admin',
    details: {
      Purpose: 'Post-Matric Scholarship Scheme Verification',
      Semester: '6th Semester (CSE)',
      AcademicYear: '2025-2026',
    },
    timeline: [
      { step: 'Application Submitted', role: 'Student', status: 'completed', updatedAt: 'Yesterday 11:30 AM' },
      { step: 'Faculty Mentor Endorsement', role: 'Prof. Sneha Mohanty', status: 'completed', updatedAt: 'Yesterday 14:15', signatureUrl: 'Prof. Sneha Mohanty (Faculty Mentor)' },
      { step: 'HOD Clearance', role: 'Dr. Rajesh Senapati', status: 'completed', updatedAt: 'Yesterday 16:45', signatureUrl: 'Dr. Rajesh Senapati (HOD CSE)' },
      { step: 'Academic Cell Dispatch', role: 'Dean Office', status: 'completed', updatedAt: 'Today 10:00 AM', signatureUrl: 'Dean of Student Affairs (Institutional Seal)' },
    ],
  },
];

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread_cse_official',
    type: 'channel',
    name: 'Computer Science Department Official Broadcast',
    subtitle: 'Dr. Rajesh Senapati, HOD',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80',
    unreadCount: 1,
    lastMessage: 'Lab 4 access credentials for all hackathon finalists have been dispatched.',
    lastMessageTime: '12:40 PM',
    isOfficial: true,
  },
  {
    id: 'thread_warden_niranjan',
    type: 'dm',
    name: 'Mr. Niranjan Sahu (Chief Warden)',
    subtitle: 'Hostel Block A Administration',
    role: 'warden',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    unreadCount: 0,
    lastMessage: 'Your day out pass for today is approved. Be back by 20:30 hours.',
    lastMessageTime: '15:15 PM',
    isOnline: true,
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  thread_warden_niranjan: [
    {
      id: 'm1',
      threadId: 'thread_warden_niranjan',
      senderId: 'usr_student_01',
      senderName: 'Arya Pattnayak',
      senderRole: 'student',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'Good afternoon Sir, I have submitted a Day Out pass for purchasing project microcontrollers and reference texts from Master Canteen market.',
      timestamp: '15:10 PM',
      isMe: true,
      status: 'read',
    },
    {
      id: 'm2',
      threadId: 'thread_warden_niranjan',
      senderId: 'usr_warden_01',
      senderName: 'Mr. Niranjan Sahu',
      senderRole: 'warden',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      text: 'Your day out pass is approved. Return strictly by 20:30 hours. Ensure you scan the QR at Gate 1.',
      timestamp: '15:15 PM',
      isMe: false,
      status: 'read',
    },
  ],
};

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-901',
    timestamp: 'Today, 15:15 PM',
    actorName: 'Mr. Niranjan Sahu',
    actorRole: 'warden',
    action: 'APPROVE_GATEPASS',
    target: 'GP-2026-9042 (Arya Pattnayak - 2501CSE008)',
    details: 'Approved Day Outing until 20:30 hours. Purpose: Project hardware procurement.',
  },
];

interface AppState {
  isAuthenticated: boolean;
  currentRole: Role;
  currentUser: UserProfile;
  profiles: Record<Role, UserProfile>;
  language: Language;
  
  isOffline: boolean;
  activeTab: 'home' | 'messages' | 'services' | 'issues' | 'profile';
  isCreateSceneOpen: boolean;
  activeStoryIndex: number | null;
  selectedThreadId: string | null;
  
  canteenMenu: CanteenDailyMenu;
  emergencyAlert: EmergencyAlert;

  teacherClasses: TeacherClass[];
  gatePasses: GatePass[];
  notices: NoticePost[];
  issues: CampusIssue[];
  applications: ServiceApplication[];
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>;
  auditLogs: AuditLogItem[];

  // Actions
  login: (role?: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  setLanguage: (lang: Language) => void;
  toggleOffline: () => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setCreateSceneOpen: (open: boolean) => void;
  openStory: (index: number) => void;
  closeStory: () => void;
  selectThread: (threadId: string | null) => void;

  updateCanteenMenu: (menu: Partial<CanteenDailyMenu>) => void;
  triggerEmergencyAlert: (type: EmergencyAlert['type'], title: string, message: string) => void;
  dismissEmergencyAlert: () => void;

  adminEditUserProfile: (roleKey: Role, updatedData: Partial<UserProfile>) => void;
  toggleStudentAttendance: (classId: string, rollNo: string) => void;
  submitClassAttendance: (classId: string, date: string, timeSlot: string) => void;
  saveTeacherDigitalSignature: (signature: string) => void;
  createGroupChannel: (name: string, subtitle: string, type: 'channel' | 'dm') => void;
  requestGatePass: (newPass: Omit<GatePass, 'id' | 'studentId' | 'studentName' | 'rollNo' | 'department' | 'hostelBlock' | 'roomNo' | 'approvedBy' | 'approvedAt' | 'qrToken' | 'status'>) => void;
  verifyGuardScan: (qrToken: string, action: 'exit' | 'entry') => { success: boolean; message: string; pass?: GatePass };
  toggleNoticeGotIt: (noticeId: string) => void;
  createNotice: (title: string, content: string, groupName: string, tags: string[], isUrgent?: boolean, imageUrl?: string) => void;
  toggleIssueUpvote: (issueId: string) => void;
  createIssue: (title: string, description: string, category: CampusIssue['category'], location: string) => void;
  updateIssueStatus: (issueId: string, status: CampusIssue['status'], note?: string) => void;
  approveApplication: (appId: string, remarks?: string) => void;
  sendMessage: (threadId: string, text: string) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => set({ isOffline: false }));
    window.addEventListener('offline', () => set({ isOffline: true }));
  }

  return {
    isAuthenticated: false, // Default false: Starts directly on Institutional Login Screen!
    currentRole: 'student',
    currentUser: DEMO_PROFILES.student,
    profiles: DEMO_PROFILES,
    language: 'en',
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    activeTab: 'home',
    isCreateSceneOpen: false,
    activeStoryIndex: null,
    selectedThreadId: null,

    canteenMenu: INITIAL_CANTEEN_MENU,
    emergencyAlert: INITIAL_EMERGENCY_ALERT,

    teacherClasses: INITIAL_TEACHER_CLASSES,
    gatePasses: INITIAL_GATE_PASSES,
    notices: INITIAL_NOTICES,
    issues: INITIAL_ISSUES,
    applications: INITIAL_APPLICATIONS,
    threads: INITIAL_THREADS,
    messages: INITIAL_MESSAGES,
    auditLogs: INITIAL_AUDIT_LOGS,

    login: (role = 'student') => {
      const profiles = get().profiles;
      const user = profiles[role] || DEMO_PROFILES[role];
      set({
        isAuthenticated: true,
        currentRole: role,
        currentUser: user,
      });
    },

    logout: () => {
      set({
        isAuthenticated: false,
        activeTab: 'home',
      });
    },

    setRole: (role) => {
      const profiles = get().profiles;
      const user = profiles[role] || DEMO_PROFILES[role];
      set({
        currentRole: role,
        currentUser: user,
        isCreateSceneOpen: false,
        selectedThreadId: null,
      });
    },

    setLanguage: (language) => set({ language }),

    toggleOffline: () => set((state) => ({ isOffline: !state.isOffline })),

    setActiveTab: (activeTab) => set({ activeTab, selectedThreadId: null, isCreateSceneOpen: false }),

    setCreateSceneOpen: (open) => set({ isCreateSceneOpen: open }),

    openStory: (index) => set({ activeStoryIndex: index }),

    closeStory: () => set({ activeStoryIndex: null }),

    selectThread: (threadId) => set({ selectedThreadId: threadId }),

    updateCanteenMenu: (menu) => {
      const { canteenMenu, auditLogs, currentUser } = get();
      const updated = { ...canteenMenu, ...menu };

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'UPDATE_CANTEEN_MENU',
        target: 'Campus Dining Hall Mess 2',
        details: `Special dish: ${updated.specialDish || 'Standard menu'}`,
      };

      set({
        canteenMenu: updated,
        auditLogs: [newAudit, ...auditLogs],
      });
    },

    triggerEmergencyAlert: (type, title, message) => {
      const { currentUser, auditLogs } = get();
      const alert: EmergencyAlert = {
        active: true,
        type,
        title,
        message,
        issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        issuedBy: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
        musterPoint: 'Central Convocation Sports Field Ground',
        emergencyPhone: '+91 98533 11223',
      };

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'TRIGGER_EMERGENCY_SIREN',
        target: `${type.toUpperCase()} WARNING`,
        details: title,
      };

      set({
        emergencyAlert: alert,
        auditLogs: [newAudit, ...auditLogs],
      });
    },

    dismissEmergencyAlert: () => {
      set((state) => ({
        emergencyAlert: {
          ...state.emergencyAlert,
          active: false,
        },
      }));
    },

    adminEditUserProfile: (roleKey, updatedData) => {
      const { profiles, currentUser, currentRole, auditLogs } = get();
      const targetUser = profiles[roleKey];
      if (!targetUser) return;

      const modified = { ...targetUser, ...updatedData };
      const newProfiles = { ...profiles, [roleKey]: modified };

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: 'admin',
        action: 'ADMIN_OVERRIDE_PROFILE',
        target: `${modified.name} (${roleKey})`,
        details: `Profile credentials updated by Administrator.`,
      };

      set({
        profiles: newProfiles,
        currentUser: currentRole === roleKey ? modified : currentUser,
        auditLogs: [newAudit, ...auditLogs],
      });
    },

    toggleStudentAttendance: (classId, rollNo) => {
      set((state) => ({
        teacherClasses: state.teacherClasses.map((cls) => {
          if (cls.id === classId) {
            const updatedStudents = cls.students.map((st) =>
              st.rollNo === rollNo ? { ...st, present: !st.present } : st
            );
            const presentCount = updatedStudents.filter((s) => s.present).length;
            const rate = Math.round((presentCount / updatedStudents.length) * 1000) / 10;
            return {
              ...cls,
              students: updatedStudents,
              attendanceRate: rate,
            };
          }
          return cls;
        }),
      }));
    },

    submitClassAttendance: (classId, date, timeSlot) => {
      const { teacherClasses, currentUser, auditLogs } = get();
      const cls = teacherClasses.find((c) => c.id === classId);
      if (!cls) return;

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'SUBMIT_CLASS_ATTENDANCE',
        target: `${cls.subjectCode} - Sec ${cls.section}`,
        details: `Attendance marked on ${date} (${timeSlot}) for ${cls.students.length} students (${cls.attendanceRate}% attendance).`,
      };

      set({
        teacherClasses: teacherClasses.map((c) =>
          c.id === classId
            ? {
                ...c,
                lastAttendanceDate: date,
                lastAttendanceSlot: timeSlot,
              }
            : c
        ),
        auditLogs: [newAudit, ...auditLogs],
      });
    },

    saveTeacherDigitalSignature: (signature) => {
      const { currentUser, profiles, currentRole } = get();
      const updated = { ...currentUser, digitalSignature: signature };
      set({
        currentUser: updated,
        profiles: { ...profiles, [currentRole]: updated },
      });
    },

    createGroupChannel: (name, subtitle, type) => {
      const { threads, currentUser, auditLogs } = get();
      const newThread: ChatThread = {
        id: `thread_${Date.now()}`,
        type,
        name,
        subtitle: subtitle || `Created by ${currentUser.name}`,
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80',
        unreadCount: 0,
        lastMessage: 'Official institutional channel initialized.',
        lastMessageTime: 'Just now',
        isOfficial: true,
        isOnline: true,
      };

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'CREATE_CAMPUS_GROUP',
        target: name,
        details: `Scope: ${type.toUpperCase()}`,
      };

      set({
        threads: [newThread, ...threads],
        auditLogs: [newAudit, ...auditLogs],
      });
    },

    requestGatePass: (newPass) => {
      const { currentUser, gatePasses, auditLogs } = get();
      const id = `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const pass: GatePass = {
        ...newPass,
        id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        rollNo: currentUser.rollNo || '2501CSE008',
        department: currentUser.department,
        hostelBlock: currentUser.hostelBlock || 'Hostel Block A',
        roomNo: currentUser.roomNo || 'Room A-204',
        approvedBy: 'Mr. Niranjan Sahu (Hostel Warden)',
        approvedAt: 'Just now',
        qrToken: `INST-${id}-${currentUser.rollNo}-${Date.now().toString(36).toUpperCase()}`,
        status: 'approved',
      };

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'REQUEST_GATEPASS',
        target: `${id} (${currentUser.name})`,
        details: `Destination: ${newPass.destination}. Purpose: ${newPass.reason}`,
      };

      set({
        gatePasses: [pass, ...gatePasses],
        auditLogs: [newAudit, ...auditLogs],
        activeTab: 'services',
      });
    },

    verifyGuardScan: (qrToken, action) => {
      const { gatePasses, auditLogs, currentUser } = get();
      const pass = gatePasses.find((p) => p.qrToken === qrToken || p.id === qrToken);

      if (!pass) {
        return { success: false, message: 'Invalid or forged QR Token. Verification rejected.' };
      }

      const updatedPasses = gatePasses.map((p) => {
        if (p.id === pass.id) {
          if (action === 'exit') {
            return {
              ...p,
              actualExitTime: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Gate 1)`,
              status: 'used' as const,
              verifiedByGuard: currentUser.name,
            };
          } else {
            return {
              ...p,
              actualReturnTime: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Gate 1)`,
              verifiedByGuard: currentUser.name,
            };
          }
        }
        return p;
      });

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: action === 'exit' ? 'GATE_EXIT_VERIFIED' : 'GATE_RETURN_VERIFIED',
        target: `${pass.id} (${pass.studentName} - ${pass.rollNo})`,
        details: `Verified by Guard: ${currentUser.name}. Recorded at Main Gate 1.`,
      };

      set({
        gatePasses: updatedPasses,
        auditLogs: [newAudit, ...auditLogs],
      });

      return {
        success: true,
        message: action === 'exit' ? 'Gate Exit recorded successfully.' : 'Student return recorded successfully.',
        pass: updatedPasses.find((p) => p.id === pass.id),
      };
    },

    toggleNoticeGotIt: (noticeId) => {
      set((state) => ({
        notices: state.notices.map((n) => {
          if (n.id === noticeId) {
            const wasGotIt = n.userGotIt;
            return {
              ...n,
              userGotIt: !wasGotIt,
              gotItCount: wasGotIt ? n.gotItCount - 1 : n.gotItCount + 1,
            };
          }
          return n;
        }),
      }));
    },

    createNotice: (title, content, groupName, tags, isUrgent = false, imageUrl) => {
      const { currentUser, notices, auditLogs } = get();
      const isVideo = imageUrl?.startsWith('data:video') || imageUrl?.endsWith('.mp4');

      const newNotice: NoticePost = {
        id: `notif_${Date.now().toString().slice(-4)}`,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        authorAvatar: currentUser.avatarUrl,
        authorTitle: `${currentUser.department} - ${currentUser.role.toUpperCase()}`,
        title,
        content,
        groupName: groupName || 'Computer Science 6th Semester',
        targetGroup: groupName || 'Computer Science 6th Semester',
        tags: tags.length ? tags : ['#announcement'],
        timestamp: 'Just now',
        isUrgent,
        imageUrl: !isVideo ? imageUrl : undefined,
        mediaUrl: imageUrl,
        mediaType: isVideo ? 'video' : 'image',
        reelImage: isUrgent ? (imageUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80') : undefined,
        gotItCount: 1,
        userGotIt: true,
        commentsCount: 0,
      };

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: isUrgent ? 'PUBLISH_URGENT_BROADCAST' : 'PUBLISH_NOTICE',
        target: title,
        details: `Target Group: ${groupName}`,
      };

      set({
        notices: [newNotice, ...notices],
        auditLogs: [newAudit, ...auditLogs],
        isCreateSceneOpen: false,
      });
    },

    toggleIssueUpvote: (issueId) => {
      set((state) => ({
        issues: state.issues.map((issue) => {
          if (issue.id === issueId) {
            const wasUpvoted = issue.userUpvoted;
            return {
              ...issue,
              userUpvoted: !wasUpvoted,
              upvotes: wasUpvoted ? issue.upvotes - 1 : issue.upvotes + 1,
            };
          }
          return issue;
        }),
      }));
    },

    createIssue: (title, description, category, location) => {
      const { currentUser, issues, auditLogs } = get();
      const id = `ISS-${Math.floor(400 + Math.random() * 500)}`;
      const newIssue: CampusIssue = {
        id,
        title,
        description,
        category,
        location,
        authorName: currentUser.name,
        authorRollNo: currentUser.rollNo || '2501CSE008',
        createdAt: 'Just now',
        upvotes: 1,
        userUpvoted: true,
        status: 'reported',
      };

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'REPORT_CAMPUS_ISSUE',
        target: `${id} (${category})`,
        details: `${title} at ${location}`,
      };

      set({
        issues: [newIssue, ...issues],
        auditLogs: [newAudit, ...auditLogs],
      });
    },

    updateIssueStatus: (issueId, status, note) => {
      const { currentUser, issues, auditLogs } = get();
      const updated = issues.map((i) => (i.id === issueId ? { ...i, status, statusUpdateNote: note || i.statusUpdateNote } : i));

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'UPDATE_ISSUE_STATUS',
        target: `${issueId} -> ${status.toUpperCase()}`,
        details: note || `Updated by ${currentUser.name}`,
      };

      set({
        issues: updated,
        auditLogs: [newAudit, ...auditLogs],
      });
    },

    approveApplication: (appId, remarks) => {
      const { currentUser, applications, auditLogs } = get();
      const signature = currentUser.digitalSignature || `${currentUser.name} (${currentUser.role.toUpperCase()})`;

      const updated = applications.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'approved' as const,
            timeline: [
              ...app.timeline,
              {
                step: 'Official Clearance & Digital Signature',
                role: currentUser.name,
                status: 'completed' as const,
                updatedAt: 'Just now',
                remarks: remarks || 'Endorsed with valid institutional digital signature.',
                signatureUrl: signature,
              },
            ],
          };
        }
        return app;
      });

      const newAudit: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'APPROVE_APPLICATION_WITH_SIGNATURE',
        target: appId,
        details: `Signed by: ${signature}`,
      };

      set({
        applications: updated,
        auditLogs: [newAudit, ...auditLogs],
      });
    },

    sendMessage: (threadId, text) => {
      const { currentUser, messages, threads } = get();
      const msg: ChatMessage = {
        id: `msg_${Date.now()}`,
        threadId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        senderAvatar: currentUser.avatarUrl,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'read',
      };

      const threadMsgs = messages[threadId] || [];
      const updatedThreads = threads.map((t) =>
        t.id === threadId ? { ...t, lastMessage: text, lastMessageTime: msg.timestamp } : t
      );

      set({
        messages: {
          ...messages,
          [threadId]: [...threadMsgs, msg],
        },
        threads: updatedThreads,
      });
    },
  };
});
