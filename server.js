import express from 'express';
import session from 'express-session';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: 'portfolio-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Database file paths
const projectsFile = 'data/projects.json';
const blogFile = 'data/blog.json';

// Initialize data files if they don't exist
async function initializeData() {
  try {
    await fs.mkdir('data', { recursive: true });
    
    // Initialize projects file
    try {
      await fs.access(projectsFile);
    } catch {
      const initialProjects = [
        {
          id: 1,
          title: "Neural Network Classifier",
          description: "Built a deep learning model for image classification using TensorFlow and Python",
          category: "AI"
        },
        {
          id: 2,
          title: "Sorting Algorithm Visualizer",
          description: "Interactive web application that visualizes different sorting algorithms in real-time",
          category: "Algorithms"
        },
        {
          id: 3,
          title: "Mathematical Modeling Tool",
          description: "Advanced tool for creating and analyzing mathematical models for research purposes",
          category: "Mathematics"
        }
      ];
      await fs.writeFile(projectsFile, JSON.stringify(initialProjects, null, 2));
    }
    
    // Initialize blog file
    try {
      await fs.access(blogFile);
    } catch {
      const initialBlog = [
        {
          id: 1,
          title: "Understanding Machine Learning Fundamentals",
          url: "https://medium.com/@example/ml-fundamentals"
        },
        {
          id: 2,
          title: "The Future of Artificial Intelligence",
          url: "https://medium.com/@example/ai-future"
        }
      ];
      await fs.writeFile(blogFile, JSON.stringify(initialBlog, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Helper functions for data operations
async function readData(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeData(filename, data) {
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

// API Routes

// Get all projects with optional filtering
app.get('/api/projects', async (req, res) => {
  const projects = await readData(projectsFile);
  const { category } = req.query;
  
  if (category && category !== 'All') {
    const filtered = projects.filter(p => p.category === category);
    return res.json(filtered);
  }
  
  res.json(projects);
});

// Get latest projects (for homepage)
app.get('/api/projects/latest', async (req, res) => {
  const projects = await readData(projectsFile);
  const latest = projects.slice(-3).reverse();
  res.json(latest);
});

// Get all blog posts
app.get('/api/blog', async (req, res) => {
  const blog = await readData(blogFile);
  res.json(blog);
});

// Get latest blog posts (for homepage)
app.get('/api/blog/latest', async (req, res) => {
  const blog = await readData(blogFile);
  const latest = blog.slice(-3).reverse();
  res.json(latest);
});

// Admin authentication middleware
function requireAuth(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === 'admin123') {
    req.session.authenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Check authentication status
app.get('/api/admin/status', (req, res) => {
  res.json({ authenticated: !!req.session.authenticated });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Admin: Add project
app.post('/api/admin/projects', requireAuth, async (req, res) => {
  const projects = await readData(projectsFile);
  const newProject = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category
  };
  projects.push(newProject);
  await writeData(projectsFile, projects);
  res.json(newProject);
});

// Admin: Delete project
app.delete('/api/admin/projects/:id', requireAuth, async (req, res) => {
  const projects = await readData(projectsFile);
  const filtered = projects.filter(p => p.id !== parseInt(req.params.id));
  await writeData(projectsFile, filtered);
  res.json({ success: true });
});

// Admin: Add blog post
app.post('/api/admin/blog', requireAuth, async (req, res) => {
  const blog = await readData(blogFile);
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    url: req.body.url
  };
  blog.push(newPost);
  await writeData(blogFile, blog);
  res.json(newPost);
});

// Admin: Delete blog post
app.delete('/api/admin/blog/:id', requireAuth, async (req, res) => {
  const blog = await readData(blogFile);
  const filtered = blog.filter(p => p.id !== parseInt(req.params.id));
  await writeData(blogFile, filtered);
  res.json({ success: true });
});

// Serve static pages
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.resolve('public/about.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.resolve('public/projects.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.resolve('public/blog.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.resolve('public/admin.html'));
});

// Initialize data and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Portfolio server running on http://localhost:${PORT}`);
  });
});