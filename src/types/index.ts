export type Role =
  | 'student'
  | 'teacher'
  | 'hod'
  | 'warden'
  | 'canteen'
  | 'accounts'
  | 'security'
  | 'admin'
  | 'principal';

export type Language = 'en' | 'hi' | 'or';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  role: Role;
  rollNo?: string;
  employeeId?: string;
  department: string;
  year?: number;
  semester?: number;
  section?: string;
  hostelBlock?: string;
  roomNo?: string;
  phone: string;
  email?: string;
  avatarUrl: string;
  bio?: string;
  thoughtNote?: string;
  languagePref: Language;
  digitalSignature?: string;
}

export interface TeacherClass {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  section: string;
  totalStudents: number;
  timeSlot: string;
  room: string;
  lastAttendanceDate?: string;
  lastAttendanceSlot?: string;
  attendanceRate: number;
  students: {
    rollNo: string;
    name: string;
    present: boolean;
  }[];
}

export type PassType = 'day_out' | 'night_out' | 'emergency' | 'market_pass';
export type PassStatus = 'approved' | 'used' | 'expired' | 'pending' | 'rejected';

export interface GatePass {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  hostelBlock: string;
  roomNo: string;
  passType: PassType;
  departureTime: string;
  expectedReturnTime: string;
  actualExitTime?: string;
  actualReturnTime?: string;
  reason: string;
  destination: string;
  parentContact: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  digitalSignature?: string;
  qrToken?: string;
  status: PassStatus;
  guardNotes?: string;
  verifiedByGuard?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StudentDirectoryItem {
  rollNo: string;
  name: string;
  department: string;
  semester: number;
  section: string;
  hostelBlock?: string;
  roomNo?: string;
  avatarUrl: string;
  phone?: string;
}

export interface NoticePost {
  id: string;
  authorName: string;
  authorRole: Role;
  authorAvatar: string;
  authorTitle: string;
  title: string;
  content: string;
  groupName: string; // Group to which this notice belongs
  targetGroup: string;
  tags: string[];
  timestamp: string;
  isUrgent?: boolean;
  reelImage?: string;
  imageUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  attachments?: { name: string; size: string; type: string }[];
  gotItCount: number;
  userGotIt?: boolean;
  commentsCount: number;
}

export interface CanteenDailyMenu {
  date: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  specialDish?: string;
  isVegOnly: boolean;
  postedBy: string;
  lastUpdated: string;
}

export interface EmergencyAlert {
  active: boolean;
  type: 'fire' | 'earthquake' | 'flood' | 'lockdown';
  title: string;
  message: string;
  issuedAt: string;
  issuedBy: string;
  musterPoint: string;
  emergencyPhone: string;
}

export type IssueCategory = 'hostel' | 'mess' | 'academic' | 'infrastructure' | 'labs';
export type IssueStatus = 'reported' | 'investigating' | 'in_progress' | 'resolved';

export interface CampusIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  authorName: string;
  authorRollNo: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  status: IssueStatus;
  statusUpdateNote?: string;
  assignedTo?: string;
  imageUrl?: string;
}

export type ApplicationType = 'leave' | 'bonafide' | 'mess_rebate' | 'no_dues';
export type ApplicationStatus = 'pending_mentor' | 'pending_hod' | 'pending_warden' | 'approved' | 'rejected';

export interface ServiceApplication {
  id: string;
  type: ApplicationType;
  title: string;
  studentName: string;
  rollNo: string;
  submittedAt: string;
  status: ApplicationStatus;
  currentApproverRole: Role;
  details: Record<string, string>;
  timeline: {
    step: string;
    role: string;
    status: 'completed' | 'current' | 'pending';
    updatedAt?: string;
    remarks?: string;
    signatureUrl?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface ChatThread {
  id: string;
  type: 'dm' | 'channel';
  name: string;
  subtitle: string;
  role?: Role;
  avatar: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOfficial?: boolean;
  isOnline?: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  action: string;
  target: string;
  details: string;
}
