import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('library.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    identifier TEXT UNIQUE,
    password TEXT,
    grade TEXT,
    strand TEXT,
    section TEXT,
    gender TEXT,
    sy TEXT,
    teacherType TEXT,
    status TEXT,
    verified BOOLEAN,
    idImage TEXT,
    rejectionCount INTEGER DEFAULT 0,
    avatar TEXT,
    passwordResetRequested BOOLEAN DEFAULT 0,
    forcePasswordChange BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT,
    subject TEXT,
    type TEXT,
    category TEXT,
    grade TEXT,
    strand TEXT,
    sections TEXT,
    uploaderId TEXT,
    uploaderName TEXT,
    date TEXT,
    isLocked BOOLEAN,
    size TEXT,
    content TEXT,
    tags TEXT
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    userId TEXT,
    title TEXT,
    content TEXT,
    type TEXT,
    date TEXT
  );
`);

try {
  db.exec('ALTER TABLE resources ADD COLUMN sections TEXT');
} catch (e) {
  // Column might already exist
}


// Seed Initial Data
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as any;
if (userCount.count === 0) {
  const initialUsers = [
    {
      id: 'admin-1',
      name: 'Cedrick Ibanez',
      role: 'Admin',
      identifier: 'cedrickibanez03@gmail.com',
      password: 'adminpanel20',
      status: 'Verified',
      verified: 1,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminCedrick'
    },
    {
      id: 'student-1',
      name: 'Cedrick Official',
      role: 'Student',
      identifier: '1082211401',
      password: 'Cedrick_2008',
      grade: '12',
      strand: 'STEM',
      section: 'HAWKING',
      status: 'Verified',
      verified: 1,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StudentCedrick'
    },
    {
      id: 'teacher-1',
      name: 'Official Teacher',
      role: 'Teacher',
      identifier: 'Exampleteacher@gmail.com',
      password: 'adminpanel.',
      teacherType: 'Adviser',
      grade: '12',
      strand: 'STEM',
      section: 'VENTER',
      status: 'Verified',
      verified: 1,
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
      status: 'Verified',
      verified: 1,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoStudent'
    },
    {
      id: 'demo-teacher',
      name: 'Demo Teacher',
      role: 'Teacher',
      identifier: 'demoteacher@gmail.com',
      password: 'password',
      teacherType: 'Subject',
      status: 'Verified',
      verified: 1,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoTeacher'
    }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, role, identifier, password, grade, strand, section, status, verified, teacherType, avatar, passwordResetRequested, forcePasswordChange)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
  `);

  for (const user of initialUsers) {
    insertUser.run(
      user.id, user.name, user.role, user.identifier, user.password,
      user.grade || null, user.strand || null, user.section || null,
      user.status, user.verified, user.teacherType || null, user.avatar
    );
  }

  const initialResources = [
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
      isLocked: 0,
      size: '12.5 MB',
      content: 'Quantum physics is the study of matter and energy at the most fundamental level. It aims to uncover the properties and behaviors of the very building blocks of nature.'
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
      isLocked: 1,
      size: '2.1 MB',
      content: 'Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, and investing.'
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
      isLocked: 0,
      size: '5.4 MB',
      content: 'Artificial Intelligence (AI) is transforming every aspect of our lives, from how we work and communicate to how we solve complex global challenges.'
    }
  ];

  const insertResource = db.prepare(`
    INSERT INTO resources (id, title, subject, type, category, grade, strand, uploaderId, uploaderName, date, isLocked, size, content, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of initialResources) {
    insertResource.run(
      r.id, r.title, r.subject, r.type, r.category,
      r.grade || null, r.strand || null,
      r.uploaderId, r.uploaderName, r.date, r.isLocked, r.size, r.content,
      JSON.stringify((r as any).tags || [])
    );
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
  });

  app.post('/api/users', (req, res) => {
    const user = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO users (id, name, role, identifier, password, grade, strand, section, gender, sy, teacherType, status, verified, idImage, rejectionCount, avatar, passwordResetRequested, forcePasswordChange)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
      `);
      stmt.run(
        user.id, user.name, user.role, user.identifier, user.password || '',
        user.grade || null, user.strand || null, user.section || null,
        user.gender || null, user.sy || null, user.teacherType || null,
        user.status, user.verified ? 1 : 0, user.idImage || null,
        user.rejectionCount || 0, user.avatar
      );
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const keys = Object.keys(updates);
      if (keys.length === 0) return res.json({ success: true });
      
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = keys.map(k => {
        if (typeof updates[k] === 'boolean') return updates[k] ? 1 : 0;
        return updates[k];
      });
      
      db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`).run(...values, id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM users WHERE id = ?').run(id);
      // Also delete notes and resources associated with the user
      db.prepare('DELETE FROM notes WHERE userId = ?').run(id);
      db.prepare('DELETE FROM resources WHERE uploaderId = ?').run(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/resources', (req, res) => {
    const resources = db.prepare('SELECT * FROM resources').all();
    res.json(resources.map((r: any) => ({
      ...r,
      isLocked: !!r.isLocked,
      tags: r.tags ? JSON.parse(r.tags) : [],
      sections: r.sections ? JSON.parse(r.sections) : []
    })));
  });

  app.post('/api/resources', (req, res) => {
    const r = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO resources (id, title, subject, type, category, grade, strand, sections, uploaderId, uploaderName, date, isLocked, size, content, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        r.id, r.title, r.subject, r.type, r.category,
        r.grade || null, r.strand || null, 
        JSON.stringify(r.sections || []),
        r.uploaderId, r.uploaderName, r.date,
        r.isLocked ? 1 : 0, r.size, r.content || 'Sample content for preview...',
        JSON.stringify(r.tags || [])
      );
      res.status(201).json(r);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/resources/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const keys = Object.keys(updates);
      if (keys.length === 0) return res.json({ success: true });
      
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = keys.map(k => {
        if (k === 'isLocked') return updates[k] ? 1 : 0;
        if (k === 'tags' || k === 'sections') return JSON.stringify(updates[k] || []);
        return updates[k];
      });
      
      db.prepare(`UPDATE resources SET ${setClause} WHERE id = ?`).run(...values, id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/resources/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM resources WHERE id = ?').run(id);
    res.json({ success: true });
  });

  app.get('/api/notes/:userId', (req, res) => {
    const { userId } = req.params;
    const notes = db.prepare('SELECT * FROM notes WHERE userId = ?').all(userId);
    res.json(notes);
  });

  app.post('/api/notes', (req, res) => {
    const n = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO notes (id, userId, title, content, type, date)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(n.id, n.userId, n.title, n.content, n.type, n.date);
      res.status(201).json(n);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
