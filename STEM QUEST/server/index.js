const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stemquest';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Models
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' },
    grade: { type: Number, min: 1, max: 12 },
    dailyPlayTime: { type: Number, default: 0 }, // in seconds
    lastPlayedDate: { type: Date, default: Date.now },
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' }
});

const ProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gameId: String,
    score: Number,
    progress: Number, // 0 to 100
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Progress = mongoose.model('Progress', ProgressSchema);

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
    const { username, password, role, grade } = req.body;
    console.log(`Registration attempt: ${username} as ${role}`);
    try {
        let user = await User.findOne({ username });
        if (user) {
            console.log('Registration failed: User exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        user = new User({ username, password, role, grade, avatar });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
        console.log('Registration successful');
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, grade: user.grade, avatar: user.avatar } });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username}`);
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Login failed: User not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login failed: Password mismatch');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
        console.log('Login successful for:', username, 'Role:', user.role);
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, grade: user.grade, avatar: user.avatar } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Server error');
    }
});

app.get('/api/auth/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Progress Tracking
app.post('/api/progress', auth, async (req, res) => {
    const { gameId, score, progress, playTime } = req.body;
    try {
        const newProgress = new Progress({ userId: req.user.id, gameId, score, progress });
        await newProgress.save();

        // Update daily play time
        const user = await User.findById(req.user.id);
        const today = new Date().toDateString();
        const lastPlayed = new Date(user.lastPlayedDate).toDateString();

        if (lastPlayed !== today) {
            user.dailyPlayTime = playTime;
        } else {
            user.dailyPlayTime += playTime;
        }
        user.lastPlayedDate = new Date();
        await user.save();

        res.json({ dailyPlayTime: user.dailyPlayTime });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Teacher: Get student progress
app.get('/api/teacher/students', auth, async (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ msg: 'Access denied' });
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        const enrichedStudents = await Promise.all(students.map(async (student) => {
            const history = await Progress.find({ userId: student._id }).sort({ timestamp: -1 });

            // Calculate some metrics for the dashboard
            const avgScore = history.length > 0
                ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
                : 0;

            const overallProgress = history.length > 0
                ? Math.max(...history.map(h => h.progress))
                : 0;

            // Simple trend calculation
            let trend = 'stable';
            if (history.length >= 2) {
                if (history[0].score > history[1].score) trend = 'up';
                else if (history[0].score < history[1].score) trend = 'down';
            }

            return {
                ...student.toObject(),
                name: student.username, // UI expects .name
                id: student._id, // UI expects .id
                overallScore: avgScore,
                overallProgress: overallProgress,
                trend: trend,
                lastActive: student.lastPlayedDate,
                history: history.slice(0, 10)
            };
        }));
        res.json(enrichedStudents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
