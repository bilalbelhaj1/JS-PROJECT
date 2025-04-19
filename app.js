import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import expressLayout from 'express-ejs-layouts';

// Routes
import mainRoute from './server/routes/main.js';
import authRoute from './server/routes/user.js';
import teacherRoute from './server/routes/teacher.js';
import studentRoute from './server/routes/student.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Configurations
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/examdb';

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(cookieParser()); // Cookie parsing middleware
app.use(expressLayout); // Express layout middleware
app.set('layout', './layouts/main'); // Set default layout for views
app.set('view engine', 'ejs'); // Set EJS as view engine

// Routes
app.use('/', mainRoute); // Main route
app.use('/auth', authRoute); // Auth route
app.use('/teacher', teacherRoute); // Teacher route
app.use('/student', studentRoute); // Student route

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// 404 Not Found handler (must come last)
app.use((req, res) => {
    res.status(404).send('404 Not Found - The page you are looking for does not exist.');
});
