import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Download, 
  UserCheck, 
  ShieldCheck, 
  Menu, 
  Bell, 
  ChevronDown, 
  Plus, 
  X, 
  FileUp, 
  Presentation, 
  StickyNote,
  LogOut,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Ban,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Search,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Role = 'Student' | 'Teacher' | 'Admin';
type Strand = 'STEM' | 'ABM' | 'HUMSS';
type Grade = '11' | '12';
type AccountStatus = 'Pending' | 'Verified' | 'Rejected' | 'Banned';

interface UserAccount {
  id: string;
  name: string;
  role: Role;
  identifier: string; // LRN or Email
  password?: string;
  section?: string;
  grade?: string;
  strand?: string;
  subject?: string;
  gender?: string;
  status: AccountStatus;
  verified: boolean;
  avatar?: string;
  idImage?: string;
  isOfficial?: boolean;
  rejectionCount: number;
  teacherType?: 'Adviser' | 'Subject';
  sy?: string;
  passwordResetRequested?: boolean;
  forcePasswordChange?: boolean;
}

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: 'ppt' | 'doc' | 'file' | 'image';
  category: 'Research' | 'General';
  grade?: Grade;
  strand?: Strand;
  sections?: string[];
  uploaderId: string;
  uploaderName: string;
  date: string;
  isLocked: boolean;
  size: string;
  content?: string;
  tags?: string[];
}

interface Note {
  id: string;
  userId: string;
  title: string;
  type: 'image' | 'ppt' | 'text' | 'doc' | 'file';
  content: string;
  date: string;
}

// --- Constants ---

const UPLOAD_SECTIONS: Record<string, string[]> = {
  '11': ['DEL MUNDO', 'ALCARAZ', 'BIYO', 'RAZON', 'EDUARDO', 'CONSUNJI', 'TOLENTINO', 'MABESA', 'JOAQUIN', 'NAKPIL', 'AMORSOLO', 'SANTIAGO'],
  '12': ['VENTER', 'HAWKING', 'TESLA', 'HEINEKEN', 'ROCKEFELLER', 'WALTON', 'TWAIN', 'GALLAGHER', 'COELHO', 'HUGO', 'DE MAUPASSANT', 'ROWLING']
};

const SECTIONS: Record<string, string[]> = {
  'STEM-11': ['DEL MUNDO', 'ALCARAZ', 'BIYO'],
  'STEM-12': ['VENTER', 'HAWKING', 'TESLA'],
  'ABM-11': ['RAZON', 'EDUARDO', 'CONSUNJI'],
  'ABM-12': ['HEINEKEN', 'ROCKEFELLER', 'WALTON'],
  'HUMSS-11': ['TOLENTINO', 'MABESA', 'JOAQUIN', 'NAKPIL', 'AMORSOLO', 'SANTIAGO'],
  'HUMSS-12': ['TWAIN', 'GALLAGHER', 'COELHO', 'HUGO', 'DE MAUPASSANT', 'ROWLING'],
};

const SCHOOL_YEARS = ['2025-2026', '2026-2027', '2027-2028', '2028-2029', '2029-2030', '2030-2031'];

const STEM_SUBJECTS: Record<'11' | '12', string[]> = {
  '11': [
    'General Mathematics',
    'Earth Science',
    'Oral Communication',
    'Reading and Writing',
    'Pagbasa at Pagsusuri',
    'Komunikasyon at Pananaliksik',
    'Personal Development',
    'Basic Calculus',
    'Pre Calculus',
    'Disaster Risk Reduction',
    'Empowerment Technology',
    'Statistics and Probability',
    'General Biology 1',
    'General Biology 2',
    '21st Century',
    'Practical Research 1',
    'HOPE 1',
    'HOPE 2'
  ],
  '12': [
    'General Physics 1',
    'General Chemistry 1',
    'Understanding Culture Society and Politics',
    'HOPE 3',
    'HOPE 4',
    'General Physics 2',
    'General Chemistry 2',
    'Entrepreneurship',
    'Philosophy',
    'Immersion',
    'Media and Information Literacy',
    'Filipino sa Piling Larang',
    'Practical Research 2',
    'Inquiries Investigation and Immersion (3is)'
  ]
};

const OFFICIAL_ACCOUNTS = {
  admin: { email: 'cedrickibanez03@gmail.com', password: 'adminpanel20' },
  student: { lrn: '1082211401', password: 'Cedrick_2008' },
  teacher: { email: 'Exampleteacher@gmail.com', password: 'adminpanel.' }
};

// --- Mock Data ---

const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'admin-1',
    name: 'Cedrick Ibanez',
    role: 'Admin',
    identifier: OFFICIAL_ACCOUNTS.admin.email,
    verified: true,
    status: 'Verified',
    isOfficial: true,
    rejectionCount: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminCedrick'
  },
  {
    id: 'student-1',
    name: 'Cedrick Official',
    role: 'Student',
    identifier: OFFICIAL_ACCOUNTS.student.lrn,
    grade: '12',
    strand: 'STEM',
    section: 'HAWKING',
    verified: true,
    status: 'Verified',
    isOfficial: true,
    rejectionCount: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StudentCedrick'
  },
  {
    id: 'teacher-1',
    name: 'Official Teacher',
    role: 'Teacher',
    identifier: OFFICIAL_ACCOUNTS.teacher.email,
    verified: true,
    status: 'Verified',
    isOfficial: true,
    rejectionCount: 0,
    teacherType: 'Adviser',
    grade: '12',
    strand: 'STEM',
    section: 'VENTER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherOfficial'
  },
  {
    id: 'demo-student',
    name: 'Demo Student',
    role: 'Student',
    identifier: '1234567890',
    password: 'password',
    grade: '11',
    strand: 'STEM',
    section: 'DEL MUNDO',
    verified: true,
    status: 'Verified',
    isOfficial: false,
    rejectionCount: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoStudent'
  },
  {
    id: 'demo-teacher',
    name: 'Demo Teacher',
    role: 'Teacher',
    identifier: 'demoteacher@gmail.com',
    password: 'password',
    verified: true,
    status: 'Verified',
    isOfficial: false,
    rejectionCount: 0,
    teacherType: 'Subject',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoTeacher'
  }
];

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Quantum Physics Basics',
    subject: 'Science',
    type: 'ppt',
    category: 'General',
    grade: '12',
    strand: 'STEM',
    uploaderId: 'teacher-1',
    uploaderName: 'Official Teacher',
    date: '2024-03-15',
    isLocked: false,
    size: '12.5 MB'
  },
  {
    id: 'r2',
    title: 'Financial Literacy 101',
    subject: 'Business',
    type: 'doc',
    category: 'General',
    grade: '11',
    strand: 'ABM',
    uploaderId: 'teacher-1',
    uploaderName: 'Official Teacher',
    date: '2024-03-16',
    isLocked: true,
    size: '2.1 MB'
  },
  {
    id: 'r3',
    title: 'Impact of AI on Modern Society',
    subject: 'Information Technology',
    type: 'file',
    category: 'Research',
    uploaderId: 'admin-1',
    uploaderName: 'Cedrick Ibanez',
    date: '2024-03-10',
    isLocked: false,
    size: '5.4 MB'
  },
  {
    id: 'r4',
    title: 'Renewable Energy Solutions',
    subject: 'Practical Research 1',
    type: 'file',
    category: 'Research',
    grade: '11',
    strand: 'STEM',
    uploaderId: 'demo-student',
    uploaderName: 'Demo Student',
    date: '2024-03-18',
    isLocked: false,
    size: '3.5 MB'
  }
];

// --- Components ---

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const dimensions = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl'
  }[size];

  return (
    <div className={`${dimensions} bg-primary rounded-full flex items-center justify-center text-white font-display shadow-lg`}>
      WL
    </div>
  );
};

const ViewModal = ({ item, onClose, onDelete }: { item: { title: string; content: string; type: string }; onClose: () => void; onDelete?: () => void }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            {item.type === 'ppt' ? <Presentation size={20} /> : item.type === 'image' ? <Camera size={20} /> : <FileText size={20} />}
          </div>
          <h3 className="font-bold text-slate-800">{item.title}</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X size={20} className="text-slate-500" />
        </button>
      </div>
      <div className="p-8 max-h-[60vh] overflow-y-auto">
        <div className="prose prose-slate max-w-none">
          {item.type === 'image' && item.content ? (
            <div className="flex justify-center">
              <img src={item.content} alt={item.title} className="max-w-full rounded-2xl shadow-lg" />
            </div>
          ) : (
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {item.content || 'No content available for preview.'}
            </p>
          )}
        </div>
      </div>
      <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
        {onDelete && (
          <button 
            onClick={onDelete}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-all mr-auto"
          >
            <Trash2 size={18} />
            Delete
          </button>
        )}
        <button 
          onClick={onClose}
          className="px-6 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all"
        >
          Close Preview
        </button>
        <button 
          onClick={() => {
            alert('Download started...');
            onClose();
          }}
          className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all flex items-center gap-2"
        >
          <Download size={18} />
          Download File
        </button>
      </div>
    </motion.div>
  </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState<'Student' | 'Admin'>('Student');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeView, setActiveView] = useState<'Resources' | 'Research' | 'Downloads' | 'Notes' | 'Verification' | 'TeacherVerification' | 'Students'>('Research');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewingItem, setViewingItem] = useState<{ id?: string; title: string; content: string; type: string; source?: 'resource' | 'note' | 'user' } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordIdentifier, setForgotPasswordIdentifier] = useState('');
  const [showForcePasswordChange, setShowForcePasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [uploadFormData, setUploadFormData] = useState<{
    file: File | null;
    title: string;
    subject: string;
    grade: string;
    strand: string;
    sections: string[];
    tags: string;
    category: Resource['category'];
  }>({
    file: null,
    title: '',
    subject: 'General',
    grade: '11',
    strand: 'STEM',
    sections: [],
    tags: '',
    category: 'General'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, resourcesRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/resources')
        ]);
        const usersData = await usersRes.json();
        const resourcesData = await resourcesRes.json();
        setAccounts(usersData);
        setResources(resourcesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetch(`/api/notes/${currentUser.id}`)
        .then(res => res.json())
        .then(data => setNotes(data))
        .catch(err => console.error('Failed to fetch notes:', err));
    }
  }, [currentUser]);
  
  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');

  // Sign Up States
  const [formData, setFormData] = useState({
    name: '',
    lrn: '',
    email: '',
    username: '',
    gender: '',
    grade: '' as Grade | '',
    strand: '' as Strand | '',
    subject: '',
    section: '',
    sy: '2025-2026',
    password: '',
    confirmPassword: '',
    regCode: '',
    idImage: null as string | null,
    teacherType: 'Subject' as 'Adviser' | 'Subject'
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check Official Accounts
    if (activeTab === 'Admin') {
      if (loginIdentifier === OFFICIAL_ACCOUNTS.admin.email && loginPassword === OFFICIAL_ACCOUNTS.admin.password) {
        const admin = accounts.find(a => a.identifier === loginIdentifier);
        setCurrentUser(admin || INITIAL_ACCOUNTS[0]);
        setIsLoggedIn(true);
        return;
      }
      if (loginIdentifier === OFFICIAL_ACCOUNTS.teacher.email && loginPassword === OFFICIAL_ACCOUNTS.teacher.password) {
        const teacher = accounts.find(a => a.identifier === loginIdentifier);
        setCurrentUser(teacher || INITIAL_ACCOUNTS[2]);
        setIsLoggedIn(true);
        return;
      }
    } else {
      if (loginIdentifier === OFFICIAL_ACCOUNTS.student.lrn && loginPassword === OFFICIAL_ACCOUNTS.student.password) {
        const student = accounts.find(a => a.identifier === loginIdentifier);
        setCurrentUser(student || INITIAL_ACCOUNTS[1]);
        setIsLoggedIn(true);
        return;
      }
    }

    // Check Created Accounts
    const user = accounts.find(a => a.identifier === loginIdentifier);
    if (user) {
      // Role-based login restriction
      if (activeTab === 'Student' && user.role !== 'Student') {
        setError('Teacher/Admin accounts cannot sign in through the Student portal.');
        return;
      }
      if (activeTab === 'Admin' && user.role === 'Student') {
        setError('Student accounts cannot sign in through the Teacher/Admin portal.');
        return;
      }

      if (user.status === 'Banned') {
        setError('This account has been banned due to multiple verification failures.');
        return;
      }
      
      // Check password (in this demo we check against the stored password)
      // Note: In a real app, use hashing.
      if (user.password && loginPassword !== user.password) {
        setError('Incorrect password.');
        return;
      }

      if (user.forcePasswordChange) {
        setCurrentUser(user);
        setShowForcePasswordChange(true);
        return;
      }

      setCurrentUser(user);
      setIsLoggedIn(true);
    } else {
      setError('Invalid credentials or account not found.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = accounts.find(a => a.identifier === forgotPasswordIdentifier);
    if (!user) {
      setError('Account not found.');
      return;
    }
    
    await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwordResetRequested: true })
    });
    
    setAccounts(prev => prev.map(a => a.id === user.id ? { ...a, passwordResetRequested: true } : a));
    setShowForgotPassword(false);
    setError('Password reset requested. Please wait for a teacher to approve.');
  };

  const handleForcePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!currentUser) return;

    await fetch(`/api/users/${currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword, forcePasswordChange: false })
    });

    setAccounts(prev => prev.map(a => a.id === currentUser.id ? { ...a, password: newPassword, forcePasswordChange: false } : a));
    setCurrentUser({ ...currentUser, password: newPassword, forcePasswordChange: false });
    setShowForcePasswordChange(false);
    setIsLoggedIn(true);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (activeTab === 'Student') {
      if (!/^\d+$/.test(formData.lrn)) {
        setError('LRN must be numbers only.');
        return;
      }
      if (accounts.some(a => a.identifier === formData.lrn)) {
        setError('LRN already in use. Auto-rejected.');
        return;
      }
    }

    const isSecretAdmin = activeTab === 'Admin' && formData.email.endsWith('-admin');
    const isAutoVerifiedTeacher = activeTab === 'Admin' && formData.regCode === '93864';
    const role: Role = isSecretAdmin ? 'Admin' : (activeTab === 'Admin' ? 'Teacher' : 'Student');

    const newUser: UserAccount = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || formData.username,
      role: role,
      identifier: activeTab === 'Student' ? formData.lrn : formData.email,
      password: formData.password,
      grade: formData.grade,
      strand: formData.strand,
      subject: formData.subject,
      section: formData.section,
      gender: formData.gender,
      sy: formData.sy,
      teacherType: activeTab === 'Admin' ? formData.teacherType : undefined,
      status: activeTab === 'Student' ? 'Pending' : (isSecretAdmin || isAutoVerifiedTeacher ? 'Verified' : 'Pending'),
      verified: isSecretAdmin || isAutoVerifiedTeacher,
      idImage: formData.idImage || undefined,
      rejectionCount: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || formData.username}`
    };

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).then(res => {
      if (res.ok) {
        setAccounts([...accounts, newUser]);
        setCurrentUser(newUser);
        setIsLoggedIn(true);
        setIsSignUp(false);
      } else {
        setError('Failed to create account.');
      }
    });
  };

  const handleFileUpload = async (type: 'image' | 'ppt' | 'text' | 'doc') => {
    if (!currentUser) return;
    
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      title: `My ${type.toUpperCase()} Note`,
      type,
      content: `This is the detailed content for your ${type} note. You can view, edit, and manage your notes here.`,
      date: new Date().toLocaleDateString()
    };
    
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    });
    if (res.ok) {
      setNotes([newNote, ...notes]);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (confirm('Are you sure you want to delete this account? This will also delete all their resources and notes.')) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setAccounts(prev => prev.filter(a => a.id !== id));
          if (currentUser?.id === id) {
            setIsLoggedIn(false);
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Failed to delete account:', err);
      }
    }
  };

  const handleVerify = async (accountId: string, approve: boolean) => {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return;

    let newStatus = acc.status;
    let newVerified = acc.verified;
    let newRejectionCount = acc.rejectionCount;

    if (approve) {
      newStatus = 'Verified';
      newVerified = true;
    } else {
      newRejectionCount++;
      if (newRejectionCount >= 2) {
        newStatus = 'Banned';
      } else {
        newStatus = 'Rejected';
      }
    }

    await fetch(`/api/users/${accountId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, verified: newVerified, rejectionCount: newRejectionCount })
    });

    setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, status: newStatus, verified: newVerified, rejectionCount: newRejectionCount } : a));
  };

  const handleResourceAction = async (resourceId: string, action: 'delete' | 'lock' | 'unlock' | 'edit') => {
    if (action === 'delete') {
      if (confirm('Are you sure you want to delete this resource?')) {
        await fetch(`/api/resources/${resourceId}`, { method: 'DELETE' });
        setResources(prev => prev.filter(r => r.id !== resourceId));
      }
    } else if (action === 'edit') {
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        setEditingResource(resource);
        setUploadFormData({
          file: null,
          title: resource.title,
          subject: resource.subject,
          grade: resource.grade || '11',
          strand: resource.strand || 'STEM',
          sections: resource.sections || [],
          tags: resource.tags?.join(', ') || ''
        });
        setShowEditResourceModal(true);
      }
    } else {
      const isLocked = action === 'lock';
      await fetch(`/api/resources/${resourceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLocked })
      });
      setResources(prev => prev.map(r => 
        r.id === resourceId ? { ...r, isLocked } : r
      ));
    }
  };

  const handleUploadResource = async (title: string, subject: string, type: Resource['type'], category: Resource['category'], sections?: string[], tags?: string[], content?: string, size?: number, grade?: Grade, strand?: string) => {
    if (!currentUser) return;
    
    // Format size
    let sizeString = '0 KB';
    if (size) {
      if (size > 1024 * 1024) sizeString = `${(size / (1024 * 1024)).toFixed(1)} MB`;
      else sizeString = `${(size / 1024).toFixed(1)} KB`;
    }

    const newResource: Resource = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      subject,
      type,
      category,
      grade: grade || currentUser.grade as Grade,
      strand: (strand || currentUser.strand) as Strand,
      sections: sections || (currentUser.section ? [currentUser.section] : []),
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      isLocked: false,
      size: sizeString,
      content: content || '',
      tags: tags || []
    };
    
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResource)
    });
    if (res.ok) {
      setResources([newResource, ...resources]);
    }
  };

  const handleUpdateResource = async (id: string, updates: Partial<Resource>) => {
    const res = await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      setResources(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 text-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <Logo />
            <div className="space-y-1">
              <h1 className="text-5xl font-display text-primary tracking-wider uppercase">Westeners' library</h1>
              <p className="text-slate-500 font-heading font-medium">Your online educational resource hub.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
            <div className="flex border-b border-slate-100">
              {(['Student', 'Admin'] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setActiveTab(role as 'Student' | 'Admin');
                    setError('');
                  }}
                  className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
                    activeTab === role ? 'text-primary' : 'text-slate-400'
                  }`}
                >
                  {role === 'Admin' ? 'Teacher/Admin' : role}
                  {activeTab === role && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {!isSignUp ? (
              !showForgotPassword ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <input
                      type={activeTab === 'Student' ? 'number' : 'text'}
                      value={loginIdentifier || ''}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={activeTab === 'Student' ? 'LRN (Numbers Only)' : 'Email Address'}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword || ''}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm font-medium text-primary hover:underline">
                      Forgot Password?
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    Sign in
                  </button>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <p className="text-sm text-slate-500">
                      Don't have an account? <button type="button" onClick={() => setIsSignUp(true)} className="text-primary font-bold hover:underline">Sign up</button>
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Credentials (Trial)</p>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="text-xs text-slate-600">
                          <span className="font-bold">Demo Student:</span> 1234567890 / Password: password
                        </div>
                        <div className="text-xs text-slate-600">
                          <span className="font-bold">Demo Teacher:</span> demoteacher@gmail.com / Password: password
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={forgotPasswordIdentifier || ''}
                      onChange={(e) => setForgotPasswordIdentifier(e.target.value)}
                      placeholder={activeTab === 'Student' ? 'LRN (Numbers Only)' : 'Email Address'}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    Request Password Reset
                  </button>
                  <button type="button" onClick={() => setShowForgotPassword(false)} className="w-full text-sm text-slate-500 font-medium hover:underline">
                    Back to Sign in
                  </button>
                </form>
              )
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4 text-left max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'Student' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">LRN</label>
                      <input
                        type="text"
                        placeholder="Numbers only"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        onChange={(e) => setFormData({...formData, lrn: e.target.value.replace(/\D/g, '')})}
                        value={formData.lrn || ''}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          value={formData.gender || ''}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Grade</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          value={formData.grade || ''}
                          onChange={(e) => setFormData({...formData, grade: e.target.value as Grade, section: ''})}
                          required
                        >
                          <option value="">Select</option>
                          <option value="11">Grade 11</option>
                          <option value="12">Grade 12</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Strand</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.strand || ''}
                        onChange={(e) => setFormData({...formData, strand: e.target.value as Strand, section: ''})}
                        required
                      >
                        <option value="">Select</option>
                        <option value="STEM">STEM</option>
                        <option value="ABM">ABM</option>
                        <option value="HUMSS">HUMSS</option>
                      </select>
                    </div>
                    {formData.strand === 'STEM' && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          value={formData.subject || ''}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          required
                        >
                          <option value="">Select Subject</option>
                          {(formData.grade ? STEM_SUBJECTS[formData.grade as '11' | '12'] : []).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {formData.grade && formData.strand && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Section</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          value={formData.section || ''}
                          onChange={(e) => setFormData({...formData, section: e.target.value})}
                          required
                        >
                          <option value="">Select Section</option>
                          {SECTIONS[`${formData.strand}-${formData.grade}`]?.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">School Year</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.sy || ''}
                        onChange={(e) => setFormData({...formData, sy: e.target.value})}
                        required
                      >
                        {SCHOOL_YEARS.map(sy => <option key={sy} value={sy}>{sy}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">ID Verification</label>
                      <div className="flex items-center gap-4">
                        <label className={`flex-1 py-3 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${formData.idImage ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 text-slate-400 hover:border-primary hover:text-primary'}`}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setFormData({...formData, idImage: reader.result as string});
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          {formData.idImage ? <CheckCircle2 size={20} /> : <Camera size={20} />}
                          <span className="text-[10px] font-bold uppercase">{formData.idImage ? 'ID Uploaded' : 'Upload ID Picture'}</span>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
                      <input
                        type="text"
                        placeholder="Username"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.username || ''}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                      <input
                        type="email"
                        placeholder="Email address"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          value={formData.gender || ''}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Teacher Type</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          onChange={(e) => setFormData({...formData, teacherType: e.target.value as 'Adviser' | 'Subject'})}
                          value={formData.teacherType}
                          required
                        >
                          <option value="Subject">Subject Teacher</option>
                          <option value="Adviser">Adviser</option>
                        </select>
                      </div>
                    </div>

                    {formData.teacherType === 'Adviser' && (
                      <div className="space-y-4 pt-2 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Advisory Details</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Grade</label>
                            <select 
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                              value={formData.grade || ''}
                              onChange={(e) => setFormData({...formData, grade: e.target.value as Grade, section: ''})}
                              required
                            >
                              <option value="">Select</option>
                              <option value="11">Grade 11</option>
                              <option value="12">Grade 12</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Strand</label>
                            <select 
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                              value={formData.strand || ''}
                              onChange={(e) => setFormData({...formData, strand: e.target.value as Strand, section: ''})}
                              required
                            >
                              <option value="">Select</option>
                              <option value="STEM">STEM</option>
                              <option value="ABM">ABM</option>
                              <option value="HUMSS">HUMSS</option>
                            </select>
                          </div>
                        </div>
                        {formData.strand === 'STEM' && (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject</label>
                            <select 
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                              value={formData.subject || ''}
                              onChange={(e) => setFormData({...formData, subject: e.target.value})}
                              required
                            >
                              <option value="">Select Subject</option>
                              {(formData.grade ? STEM_SUBJECTS[formData.grade as '11' | '12'] : []).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        {formData.grade && formData.strand && (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Section</label>
                            <select 
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                              value={formData.section || ''}
                              onChange={(e) => setFormData({...formData, section: e.target.value})}
                              required
                            >
                              <option value="">Select Section</option>
                              {SECTIONS[`${formData.strand}-${formData.grade}`]?.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">School Year</label>
                          <select 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            value={formData.sy || ''}
                            onChange={(e) => setFormData({...formData, sy: e.target.value})}
                            required
                          >
                            {SCHOOL_YEARS.map(sy => <option key={sy} value={sy}>{sy}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Registration Code</label>
                      <input
                        type="text"
                        placeholder="Optional"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.regCode || ''}
                        onChange={(e) => setFormData({...formData, regCode: e.target.value})}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.confirmPassword || ''}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Create Account
                </button>

                <button type="button" onClick={() => setIsSignUp(false)} className="w-full text-sm text-slate-500 font-medium hover:underline">
                  Back to Sign in
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const isStudent = currentUser?.role === 'Student';
  const isTeacher = currentUser?.role === 'Teacher';
  const isAdmin = currentUser?.role === 'Admin';
  const isVerified = currentUser?.verified;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: (isSidebarOpen || isDesktop) ? 0 : -300 }}
          className="fixed lg:static inset-y-0 left-0 w-[280px] bg-white border-r border-slate-100 z-50 lg:translate-x-0"
        >
          <div className="p-6 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <h2 className="text-xl font-display text-primary uppercase tracking-wide">Westeners' library</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

        <nav className="p-4 space-y-2">
          {isAdmin && (
            <SidebarItem 
              icon={<Users size={20} />} 
              label="All Accounts" 
              active={activeView === 'Students'} 
              onClick={() => { setActiveView('Students'); setIsSidebarOpen(false); setSearchQuery(''); setSelectedSubject('All'); }} 
            />
          )}

          {isTeacher && (
            <SidebarItem 
              icon={<Users size={20} />} 
              label="Students Account" 
              active={activeView === 'Students'} 
              onClick={() => { setActiveView('Students'); setIsSidebarOpen(false); setSearchQuery(''); setSelectedSubject('All'); }} 
            />
          )}

          <SidebarItem 
            icon={<FileText size={20} />} 
            label="Research Papers" 
            active={activeView === 'Research'} 
            onClick={() => { setActiveView('Research'); setIsSidebarOpen(false); setSearchQuery(''); setSelectedSubject('All'); }} 
          />

          <SidebarItem 
            icon={<Presentation size={20} />} 
            label="Resources" 
            active={activeView === 'Resources'} 
            onClick={() => { setActiveView('Resources'); setIsSidebarOpen(false); setSearchQuery(''); setSelectedSubject('All'); }} 
          />

          <SidebarItem 
            icon={<Download size={20} />} 
            label="Downloads" 
            active={activeView === 'Downloads'} 
            onClick={() => { setActiveView('Downloads'); setIsSidebarOpen(false); setSearchQuery(''); setSelectedSubject('All'); }} 
          />

          {isStudent && (
            <SidebarItem 
              icon={<StickyNote size={20} />} 
              label="My Notes" 
              active={activeView === 'Notes'} 
              onClick={() => { setActiveView('Notes'); setIsSidebarOpen(false); setSearchQuery(''); setSelectedSubject('All'); }} 
            />
          )}

          {(isAdmin || isTeacher) && (
            <SidebarItem 
              icon={<UserCheck size={20} />} 
              label="Students Verification" 
              active={activeView === 'Verification'} 
              onClick={() => { setActiveView('Verification'); setIsSidebarOpen(false); }} 
            />
          )}

          {isAdmin && (
            <SidebarItem 
              icon={<ShieldCheck size={20} />} 
              label="Teacher Verification" 
              active={activeView === 'TeacherVerification'} 
              onClick={() => { setActiveView('TeacherVerification'); setIsSidebarOpen(false); }} 
            />
          )}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-50 rounded-lg lg:hidden">
              <Menu size={24} className="text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              {isAdmin ? 'Admin Dashboard' : isStudent ? 'Student Portal' : 'Teacher Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {!isVerified && isStudent && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100">
                <AlertCircle size={14} />
                Unverified Account
              </div>
            )}
            
            {(isAdmin || isTeacher) && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-slate-50 rounded-full relative transition-colors"
                >
                  <Bell size={20} className="text-slate-600" />
                  {accounts.some(a => a.passwordResetRequested) && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 max-h-[400px] overflow-y-auto"
                    >
                      <div className="px-4 py-2 border-b border-slate-50">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                      </div>
                      {accounts.filter(a => a.passwordResetRequested).length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">No new notifications</div>
                      ) : (
                        accounts.filter(a => a.passwordResetRequested).map(account => (
                          <div key={account.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <p className="text-sm text-slate-800"><span className="font-bold">{account.name}</span> requested a password reset.</p>
                            <div className="mt-2 flex gap-2">
                              <button 
                                onClick={async () => {
                                  alert(`Password for ${account.name} is: ${account.password}`);
                                  await fetch(`/api/users/${account.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ passwordResetRequested: false, forcePasswordChange: true })
                                  });
                                  setAccounts(prev => prev.map(a => a.id === account.id ? { ...a, passwordResetRequested: false, forcePasswordChange: true } : a));
                                }}
                                className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover"
                              >
                                Approve Reset & Force Change
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-full transition-all">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isAdmin ? 'bg-red-500' : isStudent ? 'bg-primary' : 'bg-emerald-500'}`}>
                  {currentUser?.name.substring(0, 2).toUpperCase()}
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="font-bold text-slate-800">{currentUser?.name}</p>
                      <p className="text-xs text-slate-400">{currentUser?.identifier}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowSettings(true);
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Settings size={18} />
                      Account Settings
                    </button>
                    <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={18} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          {(activeView === 'Resources' || activeView === 'Research') && (() => {
            const visibleResources = resources
              .filter(r => r.category === (activeView === 'Research' ? 'Research' : 'General'))
              .filter(r => {
                // Visibility logic
                let isVisible = false;
                if (isAdmin || isTeacher) {
                  isVisible = true;
                } else if (currentUser?.id === 'demo-student') {
                  isVisible = r.uploaderId === 'demo-teacher';
                } else if (r.uploaderId === 'demo-teacher') {
                  isVisible = false;
                } else {
                  // Real student
                  if (r.isLocked) {
                    isVisible = false;
                  } else {
                    const query = searchQuery.toLowerCase();
                    const isSearchingTeacher = query && r.uploaderName.toLowerCase().includes(query);
                    if (isSearchingTeacher) {
                      isVisible = true;
                    } else {
                      // Strict filtering based on Grade, Strand, and Section
                      const matchesGrade = !r.grade || r.grade === currentUser?.grade;
                      const matchesStrand = !r.strand || r.strand === currentUser?.strand;
                      const matchesSection = !r.sections || r.sections.length === 0 || (currentUser?.section && r.sections.includes(currentUser.section));
                      
                      isVisible = matchesGrade && matchesStrand && matchesSection;
                    }
                  }
                }
                
                if (!isVisible) return false;

                // Search and filter logic
                const query = searchQuery.toLowerCase();
                const matchesSearch = r.title.toLowerCase().includes(query) || 
                                    r.subject.toLowerCase().includes(query) || 
                                    r.uploaderName.toLowerCase().includes(query);
                const matchesSubject = selectedSubject === 'All' || r.subject === selectedSubject;
                const matchesTags = selectedTags.length === 0 || selectedTags.every(t => r.tags?.includes(t));
                return matchesSearch && matchesSubject && matchesTags;
              });

            return (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-800">{activeView === 'Research' ? 'Past Research Papers' : 'Educational Resources'}</h2>
                  <p className="text-sm text-slate-400">Total: {visibleResources.length} items</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      placeholder="Search title, teacher..."
                      value={searchQuery || ''}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                    />
                  </div>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                  >
                    <option value="All">All Subjects</option>
                    {Array.from(new Set(resources.map(r => r.subject))).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {(isAdmin || isTeacher || isStudent) && (
                      <button 
                        onClick={() => {
                          setUploadFormData({
                            file: null,
                            title: '',
                            subject: activeView === 'Notes' || isStudent ? 'My Notes' : 'General',
                            grade: currentUser?.grade || '11',
                            strand: currentUser?.strand || 'STEM',
                            sections: [],
                            tags: '',
                            category: activeView === 'Research' ? 'Research' : 'General'
                          });
                          setShowUploadModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all whitespace-nowrap"
                      >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Upload {activeView === 'Research' ? 'Paper' : (activeView === 'Notes' || isStudent ? 'Note' : 'Resource')}</span>
                      </button>
                  )}
                </div>
                {Array.from(new Set(resources.flatMap(r => r.tags || []))).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Array.from(new Set(resources.flatMap(r => r.tags || []))).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedTags.includes(tag) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {visibleResources
                  .map(resource => (
                    <div key={resource.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${resource.isLocked ? 'bg-red-50 text-red-400' : 'bg-slate-50 text-slate-400'}`}>
                          {resource.type === 'ppt' ? <Presentation size={24} /> : <FileText size={24} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-800">{resource.title}</h4>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{resource.subject}</span>
                            {resource.tags?.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase">{tag}</span>
                            ))}
                            {resource.isLocked && <ShieldCheck size={14} className="text-red-500" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {resource.type.toUpperCase()} • {resource.size} • By {resource.uploaderName} • {resource.date}
                            {resource.sections && resource.sections.length > 0 && ` • Sections: ${resource.sections.join(', ')}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <button 
                          onClick={() => setViewingItem({ id: resource.id, title: resource.title, content: resource.content || '', type: resource.type, source: 'resource' })}
                          className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
                          title="View"
                        >
                          <Eye size={20} />
                        </button>
                        {(isAdmin || currentUser?.id === resource.uploaderId) && (
                        <>
                          <button 
                            onClick={() => handleResourceAction(resource.id, 'edit')}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                            title="Edit"
                          >
                            <Settings size={18} />
                          </button>
                          <button 
                            onClick={() => handleResourceAction(resource.id, resource.isLocked ? 'unlock' : 'lock')}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                            title={resource.isLocked ? 'Unlock' : 'Lock'}
                          >
                            {resource.isLocked ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </>
                      )}
                      <button 
                        disabled={(!isVerified && isStudent) || resource.isLocked}
                        onClick={() => {
                          if (resource.content) {
                            const a = document.createElement('a');
                            if (resource.type === 'image' && resource.content.startsWith('data:image')) {
                              a.href = resource.content;
                              a.download = `${resource.title}.png`;
                            } else {
                              const blob = new Blob([resource.content], { type: 'text/plain' });
                              a.href = URL.createObjectURL(blob);
                              a.download = `${resource.title}.txt`;
                            }
                            a.click();
                          } else {
                            alert('No content available to download.');
                          }
                        }}
                        className={`p-3 rounded-xl transition-all ${((!isVerified && isStudent) || resource.isLocked) ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}
                        title={resource.isLocked ? 'This resource is locked' : (!isVerified && isStudent ? 'Verify account to download' : 'Download')}
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          })()}

          {activeView === 'Notes' && isStudent && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">My Personal Notes</h2>
                <button 
                  onClick={() => {
                    setUploadFormData({
                      file: null,
                      title: '',
                      subject: 'My Notes',
                      grade: currentUser?.grade || '11',
                      strand: currentUser?.strand || 'STEM',
                      sections: [],
                      tags: '',
                      category: 'General'
                    });
                    setShowUploadModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all"
                >
                  <Plus size={20} />
                  Upload New Note
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.filter(n => n.userId === currentUser?.id).map(note => (
                  <div key={note.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${note.type === 'ppt' ? 'bg-orange-50 text-orange-500' : 'bg-sky-50 text-sky-500'}`}>
                        {note.type === 'ppt' ? <Presentation size={20} /> : <StickyNote size={20} />}
                      </div>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{note.title}</h4>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-3">{note.content}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-xs text-slate-400">{note.date}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setViewingItem({ id: note.id, title: note.title, content: note.content, type: note.type, source: 'note' })}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Open
                        </button>
                        <button 
                          onClick={() => {
                            if (note.content) {
                              const a = document.createElement('a');
                              if (note.type === 'image' && note.content.startsWith('data:image')) {
                                a.href = note.content;
                                a.download = `${note.title}.png`;
                              } else {
                                const blob = new Blob([note.content], { type: 'text/plain' });
                                a.href = URL.createObjectURL(blob);
                                a.download = `${note.title}.txt`;
                              }
                              a.click();
                            }
                          }}
                          className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400" 
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'Downloads' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">My Downloads</h2>
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <Download size={64} className="mx-auto mb-4 text-slate-200" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Downloads Yet</h3>
                <p className="text-slate-400">Resources you download will appear here for quick access.</p>
              </div>
            </div>
          )}

          {(activeView === 'Verification' || activeView === 'TeacherVerification') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {activeView === 'TeacherVerification' ? 'Teacher Account Verification' : 'Student Account Verification'}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {accounts
                  .filter(a => {
                    const isCorrectRole = activeView === 'TeacherVerification' ? a.role === 'Teacher' : a.role === 'Student';
                    const isPending = a.status === 'Pending';
                    
                    if (!isCorrectRole || !isPending) return false;
                    
                    // If it's student verification and the current user is a teacher adviser
                    if (activeView === 'Verification' && currentUser?.role === 'Teacher' && currentUser?.teacherType === 'Adviser') {
                      return a.grade === currentUser.grade && 
                             a.strand === currentUser.strand && 
                             a.section === currentUser.section;
                    }
                    
                    return true;
                  })
                  .map(account => (
                    <div key={account.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                          <img src={account.avatar} alt={account.name} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{account.name}</h4>
                          <p className="text-xs text-slate-400">{account.identifier} • {account.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setViewingItem({ id: account.id, title: `${account.name}'s ID`, content: account.idImage || '', type: 'image', source: 'user' })}
                          className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
                        >
                          View ID
                        </button>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleVerify(account.id, true)}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                            title="Approve"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button 
                            onClick={() => handleVerify(account.id, false)}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                            title="Reject"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                {accounts.filter(a => 
                  (activeView === 'TeacherVerification' ? a.role === 'Teacher' : a.role === 'Student') && 
                  a.status === 'Pending'
                ).length === 0 && (
                  <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                    <UserCheck size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No pending verification requests.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'Students' && (isAdmin || isTeacher) && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">{isAdmin ? 'All Accounts Directory' : 'Students Directory'}</h2>
              
              {(() => {
                let displayAccounts = accounts;
                
                if (isTeacher) {
                  displayAccounts = displayAccounts.filter(a => a.role === 'Student');
                  if (currentUser?.teacherType === 'Adviser') {
                    displayAccounts = displayAccounts.filter(a => a.grade === currentUser.grade && a.strand === currentUser.strand && a.section === currentUser.section);
                  }
                } else if (isAdmin) {
                  displayAccounts = displayAccounts.filter(a => a.role === 'Student' || a.role === 'Teacher');
                }

                const grouped: Record<string, UserAccount[]> = {};
                displayAccounts.forEach(a => {
                  let key = '';
                  if (a.role === 'Teacher') {
                    key = 'Teachers';
                  } else {
                    key = a.section ? `Grade ${a.grade} - ${a.section}` : 'Unassigned Students';
                  }
                  if (!grouped[key]) grouped[key] = [];
                  grouped[key].push(a);
                });

                return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([groupName, groupAccounts]) => (
                  <div key={groupName} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-700 border-b border-slate-200 pb-2">{groupName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {groupAccounts.map(account => (
                        <div key={account.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                          <div className="flex items-center gap-4">
                            <img src={account.avatar} alt={account.name} className="w-12 h-12 rounded-full bg-slate-100 object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-800 truncate">{account.name}</h4>
                              <p className="text-xs text-slate-500 truncate">{account.role === 'Teacher' ? 'Email' : 'LRN'}: {account.identifier}</p>
                            </div>
                          </div>
                          <div className="space-y-2 pt-4 border-t border-slate-50">
                            {account.role === 'Student' && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Strand:</span>
                                <span className="text-slate-700 font-medium">{account.strand}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Status:</span>
                              <span className={`font-medium ${account.verified ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {account.verified ? 'Verified' : account.status}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                              <span className="text-slate-400">Password:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-700 font-medium font-mono">
                                  {account.passwordResetRequested ? account.password : '••••••••'}
                                </span>
                                {account.passwordResetRequested && (
                                  <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">Reset Req</span>
                                )}
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="flex justify-end pt-2">
                                <button 
                                  onClick={() => handleDeleteAccount(account.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 text-xs font-bold"
                                >
                                  <Trash2 size={16} />
                                  Delete Account
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
              
              {accounts.filter(a => isTeacher ? a.role === 'Student' : (a.role === 'Student' || a.role === 'Teacher')).length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No accounts found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FAB for Students and Teachers */}
        {(isStudent || isTeacher || isAdmin) && (
          <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
              {isFabExpanded && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex flex-col items-end gap-3">
                  {isStudent ? (
                    <>
                      <FabSubItem 
                        onClick={() => {
                          setUploadFormData({
                            file: null,
                            title: '',
                            subject: 'My Notes',
                            grade: currentUser?.grade || '11',
                            strand: currentUser?.strand || 'STEM',
                            sections: [],
                            tags: '',
                            category: 'General'
                          });
                          setActiveView('Notes');
                          setShowUploadModal(true);
                        }} 
                        icon={<Plus size={20} />} 
                        label="Upload New Note" 
                        color="bg-primary" 
                      />
                    </>
                  ) : (
                    <>
                      <FabSubItem 
                        icon={<Presentation size={20} />} 
                        label="Upload Resource" 
                        color="bg-orange-500 hover:bg-orange-600" 
                        onClick={() => {
                          setUploadFormData({
                            file: null,
                            title: '',
                            subject: 'General',
                            grade: currentUser?.grade || '11',
                            strand: currentUser?.strand || 'STEM',
                            sections: [],
                            tags: '',
                            category: 'General'
                          });
                          setShowUploadModal(true);
                        }}
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={() => setIsFabExpanded(!isFabExpanded)} className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all active:scale-90 ${isFabExpanded ? 'bg-red-500 rotate-45' : 'bg-primary'}`}>
              <Plus size={32} />
            </button>
          </div>
        )}
        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-xl"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">Upload {activeView === 'Research' ? 'Research Paper' : 'Resource'}</h3>
                  <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* File Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select File</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        accept=".ppt,.pptx,.doc,.docx,.pdf,.png,.jpg,.jpeg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadFormData(prev => ({ 
                              ...prev, 
                              file, 
                              title: prev.title || file.name.split('.')[0] 
                            }));
                          }
                        }}
                      />
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Upload size={32} />
                        <span className="text-sm font-medium text-slate-600">
                          {uploadFormData.file ? uploadFormData.file.name : 'Click or drag file to upload'}
                        </span>
                        <span className="text-xs">PPT, DOC, PDF, Images</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={uploadFormData.title}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Resource Title"
                    />
                  </div>

                  {/* Category */}
                  {!isStudent && activeView !== 'Notes' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setUploadFormData(prev => ({ ...prev, category: 'General' }))}
                          className={`flex-1 py-2 px-4 rounded-xl border transition-all font-medium ${
                            uploadFormData.category === 'General'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          General Resource
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadFormData(prev => ({ ...prev, category: 'Research' }))}
                          className={`flex-1 py-2 px-4 rounded-xl border transition-all font-medium ${
                            uploadFormData.category === 'Research'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Past Research
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Strand */}
                  {!isStudent && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Strand</label>
                      <select
                        value={uploadFormData.strand}
                        onChange={(e) => setUploadFormData(prev => ({ ...prev, strand: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="STEM">STEM</option>
                        <option value="ABM">ABM</option>
                        <option value="HUMSS">HUMSS</option>
                      </select>
                    </div>
                  )}

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    {uploadFormData.strand === 'STEM' ? (
                      <select
                        value={uploadFormData.subject}
                        onChange={(e) => setUploadFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="">Select Subject</option>
                        {(uploadFormData.grade ? STEM_SUBJECTS[uploadFormData.grade as '11' | '12'] : []).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={uploadFormData.subject}
                        onChange={(e) => setUploadFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g. Science, Math"
                      />
                    )}
                  </div>

                  {!isStudent && (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Grade */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                          <select
                            value={uploadFormData.grade}
                            onChange={(e) => setUploadFormData(prev => ({ ...prev, grade: e.target.value, sections: [] }))}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          >
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                          </select>
                        </div>
                      </div>

                      {/* Sections (Multi-select) */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sections (Select multiple)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl">
                          {UPLOAD_SECTIONS[uploadFormData.grade]?.map(section => (
                            <label key={section} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={uploadFormData.sections.includes(section)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setUploadFormData(prev => ({ ...prev, sections: [...prev.sections, section] }));
                                  } else {
                                    setUploadFormData(prev => ({ ...prev, sections: prev.sections.filter(s => s !== section) }));
                                  }
                                }}
                                className="rounded text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-slate-700">{section}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Leave empty for all sections</p>
                      </div>
                    </>
                  )}

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                    <input
                      type="text"
                      value={uploadFormData.tags}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Comma separated (e.g. Algebra, Geometry)"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!uploadFormData.file || !uploadFormData.title) {
                        alert('Please select a file and enter a title.');
                        return;
                      }

                      const file = uploadFormData.file;
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const content = e.target?.result as string;
                        let type: Resource['type'] = 'file';
                        if (file.name.match(/\.(ppt|pptx)$/i)) type = 'ppt';
                        else if (file.name.match(/\.(doc|docx)$/i)) type = 'doc';
                        else if (file.name.match(/\.(png|jpg|jpeg)$/i)) type = 'image';
                        
                        const tags = uploadFormData.tags ? uploadFormData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
                        
                        if (activeView === 'Notes' || isStudent) {
                          const newNote: Note = {
                            id: Math.random().toString(36).substr(2, 9),
                            userId: currentUser.id,
                            title: uploadFormData.title,
                            type,
                            content: content,
                            date: new Date().toLocaleDateString()
                          };
                          fetch('/api/notes', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newNote)
                          }).then(res => {
                            if (res.ok) {
                              setNotes([newNote, ...notes]);
                              if (isStudent && activeView !== 'Notes') {
                                alert('Note uploaded successfully! You can find it in "My Notes".');
                              }
                            }
                          });
                        } else {
                          handleUploadResource(
                            uploadFormData.title, 
                            uploadFormData.subject, 
                            type, 
                            uploadFormData.category, 
                            uploadFormData.sections.length > 0 ? uploadFormData.sections : undefined, 
                            tags, 
                            content, 
                            file.size, 
                            uploadFormData.grade as Grade,
                            uploadFormData.strand
                          );
                        }
                        setShowUploadModal(false);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30"
                  >
                    Upload
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Resource Modal */}
        <AnimatePresence>
          {showEditResourceModal && editingResource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-xl"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">Edit {editingResource.type === 'ppt' ? 'PPT' : 'Resource'} Visibility</h3>
                  <button onClick={() => setShowEditResourceModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={uploadFormData.title}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Resource Title"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadFormData(prev => ({ ...prev, category: 'General' }))}
                        className={`flex-1 py-2 px-4 rounded-xl border transition-all font-medium ${
                          uploadFormData.category === 'General'
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        General Resource
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadFormData(prev => ({ ...prev, category: 'Research' }))}
                        className={`flex-1 py-2 px-4 rounded-xl border transition-all font-medium ${
                          uploadFormData.category === 'Research'
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Past Research
                      </button>
                    </div>
                  </div>

                  {/* Strand */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Strand</label>
                    <select
                      value={uploadFormData.strand}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, strand: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="STEM">STEM</option>
                      <option value="ABM">ABM</option>
                      <option value="HUMSS">HUMSS</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    {uploadFormData.strand === 'STEM' ? (
                      <select
                        value={uploadFormData.subject}
                        onChange={(e) => setUploadFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="">Select Subject</option>
                        {(uploadFormData.grade ? STEM_SUBJECTS[uploadFormData.grade as '11' | '12'] : []).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={uploadFormData.subject}
                        onChange={(e) => setUploadFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g. Science, Math"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                    <select
                      value={uploadFormData.grade}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, grade: e.target.value, sections: [] }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                  </div>

                  {/* Sections (Multi-select) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sections (Select multiple)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl">
                      {UPLOAD_SECTIONS[uploadFormData.grade]?.map(section => (
                        <label key={section} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={uploadFormData.sections.includes(section)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUploadFormData(prev => ({ ...prev, sections: [...prev.sections, section] }));
                              } else {
                                setUploadFormData(prev => ({ ...prev, sections: prev.sections.filter(s => s !== section) }));
                              }
                            }}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-slate-700">{section}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Leave empty for all sections</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                    <input
                      type="text"
                      value={uploadFormData.tags}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Comma separated (e.g. Algebra, Geometry)"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowEditResourceModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!uploadFormData.title) {
                        alert('Please enter a title.');
                        return;
                      }

                      const tags = uploadFormData.tags ? uploadFormData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
                      
                      handleUpdateResource(editingResource.id, {
                        title: uploadFormData.title,
                        subject: uploadFormData.subject,
                        grade: uploadFormData.grade as Grade,
                        strand: uploadFormData.strand,
                        sections: uploadFormData.sections,
                        category: uploadFormData.category,
                        tags: tags
                      });
                      setShowEditResourceModal(false);
                    }}
                    className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {viewingItem && (
          <ViewModal 
            item={viewingItem} 
            onClose={() => setViewingItem(null)} 
            onDelete={
              (viewingItem.source === 'resource' && viewingItem.id && (isAdmin || resources.find(r => r.id === viewingItem.id)?.uploaderId === currentUser?.id)) ||
              (viewingItem.source === 'note' && viewingItem.id)
              ? () => {
                if (viewingItem.source === 'resource' && viewingItem.id) {
                  handleResourceAction(viewingItem.id, 'delete');
                  setViewingItem(null);
                } else if (viewingItem.source === 'note' && viewingItem.id) {
                  handleDeleteNote(viewingItem.id);
                  setViewingItem(null);
                }
              }
              : undefined
            }
          />
        )}

        {/* Account Settings Modal */}
        <AnimatePresence>
          {showSettings && currentUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-lg">Account Settings</h3>
                  <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <img src={currentUser.avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-slate-100 object-cover" />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        <Camera size={20} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = async (e) => {
                                const avatar = e.target?.result as string;
                                await fetch(`/api/users/${currentUser.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ avatar })
                                });
                                setAccounts(prev => prev.map(a => a.id === currentUser.id ? { ...a, avatar } : a));
                                setCurrentUser({ ...currentUser, avatar });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{currentUser.name}</h4>
                      <p className="text-sm text-slate-500">{currentUser.role} • {currentUser.identifier}</p>
                      <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${currentUser.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {currentUser.verified ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
                        {currentUser.verified ? 'Verified' : currentUser.status}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Change Profile</h4>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500">Name</label>
                      <input 
                        type="text" 
                        defaultValue={currentUser.name}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        onChange={(e) => {
                          // In a real app, we'd have a save button. For now, update on blur or just keep it simple.
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Change Password</h4>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (newPassword !== confirmNewPassword) {
                        alert('Passwords do not match');
                        return;
                      }
                      await fetch(`/api/users/${currentUser.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: newPassword })
                      });
                      setAccounts(prev => prev.map(a => a.id === currentUser.id ? { ...a, password: newPassword } : a));
                      setCurrentUser({ ...currentUser, password: newPassword });
                      setNewPassword('');
                      setConfirmNewPassword('');
                      alert('Password updated successfully');
                    }} className="space-y-3">
                      <input 
                        type="password" 
                        placeholder="New Password"
                        value={newPassword || ''}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        required
                      />
                      <input 
                        type="password" 
                        placeholder="Confirm New Password"
                        value={confirmNewPassword || ''}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        required
                      />
                      <button type="submit" className="w-full py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
                        Update Password
                      </button>
                    </form>
                  </div>

                  {isStudent && !currentUser.verified && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Upload ID</h4>
                      <p className="text-xs text-slate-500">Upload your school ID to get verified.</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                              const idImage = e.target?.result as string;
                              await fetch(`/api/users/${currentUser.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ idImage, status: 'Pending' })
                              });
                              setAccounts(prev => prev.map(a => a.id === currentUser.id ? { ...a, idImage, status: 'Pending' } : a));
                              setCurrentUser({ ...currentUser, idImage, status: 'Pending' });
                              alert('ID uploaded successfully. Please wait for verification.');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Force Password Change Modal */}
        <AnimatePresence>
          {showForcePasswordChange && currentUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl">Forgot First Password</h3>
                  <p className="text-sm text-slate-500 mt-2">You forgot your first password, so please change your password. Enter a new password below to continue.</p>
                </div>
                <form onSubmit={handleForcePasswordChange} className="space-y-4 text-left">
                  {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword || ''}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmNewPassword || ''}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                    Update Password & Continue
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-components ---

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all ${active ? 'bg-sky-50 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const AccountCard = ({ account, key }: { account: UserAccount, key?: React.Key }) => (
  <motion.div whileHover={{ y: -4 }} key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={account.avatar} alt={account.name} className="w-14 h-14 rounded-full bg-slate-100" />
          {account.verified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <ShieldCheck size={16} className="text-emerald-500 fill-emerald-50" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{account.name}</h3>
          <p className={`text-xs font-medium ${account.verified ? 'text-emerald-500' : 'text-amber-500'}`}>
            {account.verified ? 'Verified' : 'Unverified'}
          </p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400 font-medium">Role:</span>
        <span className="text-slate-600">{account.role}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400 font-medium">Identifier:</span>
        <span className="text-slate-600">{account.identifier}</span>
      </div>
      {account.section && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 font-medium">Section:</span>
          <span className="text-slate-600">{account.section}</span>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <span className="text-slate-400 font-medium">Status:</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${account.isOfficial ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
          {account.isOfficial ? 'Official' : 'Demo'}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
      <span className="mr-auto text-sm font-bold text-slate-800">Actions:</span>
      <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors">
        Block
      </button>
      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
        <Trash2 size={18} />
      </button>
    </div>
  </motion.div>
);

const FabSubItem = ({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void }) => (
  <div className="flex items-center gap-3">
    <span className="bg-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-bold text-slate-700 border border-slate-100">
      {label}
    </span>
    <button onClick={onClick} className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 ${color}`}>
      {icon}
    </button>
  </div>
);
